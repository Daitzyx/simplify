import chalk from "chalk";
import {
  checkForUncommittedChanges,
  checkIfBranchIsUpToDate,
  checkForStagedChanges,
  execPromisify,
  checkPermissions,
} from "../../utils/gitUtils.js";
import { executingPull } from "./pull.js";
import { updateStatus } from "../../utils/helper.js";
import { checkInternetConnection } from "../../utils/utils.js";

export async function handleGitPush() {
  try {
    const isConnected = await checkInternetConnection();
    if (!isConnected) {
      console.error(
        chalk.red(
          "Please check your internet connection before proceeding with Git operations.",
        ),
      );
      return;
    }

    updateStatus("Checking for uncommitted changes...");
    if (await checkForUncommittedChanges()) {
      console.error(
        chalk.red(
          "Unstaged changes detected. Please commit or stash your changes.",
        ),
      );
      return;
    }

    updateStatus("Checking for staged changes...");
    if (await checkForStagedChanges()) {
      console.error(
        chalk.red("Staged changes detected. Please commit your changes."),
      );
      return;
    }

    updateStatus("Checking if branch is up to date...");
    if (!(await checkIfBranchIsUpToDate())) {
      const result = await executingPull();
      if (result === "abort") {
        return;
      }
    }

    updateStatus("Executing git push...");
    await execPromisify("git push");
    updateStatus(chalk.green("Push successful."));
  } catch (error) {
    console.error(chalk.red(`Failed to push changes: ${error.message}`));
  }
}
