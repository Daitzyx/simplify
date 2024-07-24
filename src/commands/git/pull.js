import chalk from "chalk";
import { exec } from "child_process";
import {
  checkForConflicts,
  checkForUncommittedChanges,
  checkIfBranchIsUpToDate,
  execPromisify,
  hasUnresolvedConflicts,
} from "../../utils/gitUtils.js";
import { alreadySolveConflicts } from "../../prompts/pullPrompt.js";
import { validateUnstagedChanges } from "../../validation/gitvalidation.js";
import { updateStatus } from "../../utils/helper.js";
import { checkInternetConnection } from "../../utils/utils.js";

export async function handleGitPull() {
  const isConnected = await checkInternetConnection();
  if (!isConnected) {
    console.error(
      chalk.red(
        "Please check your internet connection before proceeding with Git operations.",
      ),
    );
    return;
  }

  const commitChanges = await checkForUncommittedChanges();
  if (commitChanges) {
    console.log(
      chalk.green(
        "Local changes detected. Please commit or stash them before pulling.",
      ),
    );
    return;
  }

  if (await checkIfBranchIsUpToDate()) {
    return;
  }

  await executingPull();
}

export async function executingPull() {
  return new Promise((resolve, reject) => {
    exec("git pull", async (error, stdout, stderr) => {
      if (error) {
        if (stderr.includes("conflict") || stdout.includes("conflict")) {
          console.error(
            chalk.red(
              "Pull failed due to merge conflicts. Please resolve them.",
            ),
          );
          try {
            const result = await performGitPullWithConflictManagement();

            resolve(result);
          } catch (conflictError) {
            reject(conflictError);
          }
        } else if (stderr.includes("Could not resolve host")) {
          console.error(
            chalk.red("Pull failed due to network or connection issue."),
          );
          reject(new Error("Network or connection issue."));
        } else {
          reject(error);
        }
      } else {
        updateStatus(chalk.green("Pull successful."));
        updateStatus(chalk.blue(stdout));
        resolve(stdout);
      }
    });
  });
}

async function performGitPullWithConflictManagement() {
  const hasConflict = await checkForConflicts();

  if (hasConflict) {
    const result = await handlePullMergeConflicts();
    if (result === "abort") {
      return "abort";
    }
  } else {
    const { stdout, stderr } = await execPromisify("git pull");
    console.log(chalk.blue(stdout));
    if (stderr) {
      console.log(chalk.yellow(`Alerts during pull: ${stderr}`));
    }
  }
}

async function handlePullMergeConflicts() {
  const action = await alreadySolveConflicts();
  switch (action) {
    case "continue":
      if (await hasUnresolvedConflicts()) {
        await performGitPullWithConflictManagement();
      } else {
        await continueMerge();
      }
      break;
    case "abort":
      await abortMerge();
      return "abort";
  }
}

async function stageChanges() {
  try {
    await execPromisify("git add .");
    console.log(chalk.green("All changes added, checking status..."));
  } catch (error) {
    console.error(chalk.red(`Failed to add changes: ${error.message}`));
    throw error;
  }
}

async function checkForUnstagedChanges() {
  try {
    const { stdout } = await execPromisify("git status --porcelain");
    const lines = stdout.split("\n");
    validateUnstagedChanges(lines);
  } catch (error) {
    throw new Error(error.message);
  }
}

async function continueMerge() {
  try {
    await stageChanges();
    await checkForUnstagedChanges();
    await execPromisify("git commit");

    console.log(chalk.green("Pull successful."));
  } catch (error) {
    console.error(
      chalk.red("An error occurred during merge continuation:"),
      error.message,
    );
  }
}

async function abortMerge() {
  try {
    await execPromisify("git merge --abort");
    console.log(chalk.yellow("Merge aborted successfully."));
    return true;
  } catch (error) {
    console.error(chalk.red("Failed to abort merge:"), error.message);
    return false;
  }
}
