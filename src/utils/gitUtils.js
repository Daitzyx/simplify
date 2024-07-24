import { exec, execSync } from "child_process";
import chalk from "chalk";
import { promises as fs } from "fs";

import { processFiles } from "../utils/helper.js";

export async function checkForUncommittedChanges() {
  return new Promise((resolve, reject) => {
    exec("git status --porcelain", (error, stdout, stderr) => {
      if (error) {
        console.error(chalk.red(`Error checking git status: ${error.message}`));
        reject(new Error(`Error checking git status: ${error.message}`));
        return;
      }
      if (stdout) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

export async function checkForStagedChanges() {
  try {
    const { stdout } = await execPromisify("git diff --staged --name-only");
    const stagedFiles = stdout.split("\n").filter((line) => line.trim() !== "");
    return stagedFiles.length > 0;
  } catch (error) {
    console.error("Error checking staged files:", error);
    throw error;
  }
}

export async function getFilesWithChanges() {
  try {
    const { stdout } = await execPromisify("git status --porcelain=v1 -uall");
    const lines = stdout.split("\n");
    const changedFiles = lines
      .filter(
        (line) =>
          line.startsWith("??") ||
          line.startsWith(" M") ||
          line.startsWith(" D") ||
          line.startsWith("A ") ||
          line.startsWith("U ") ||
          line.startsWith(" D"),
      )
      .map((line) => line.slice(3).trim());

    return await processFiles(changedFiles);
  } catch (error) {
    console.error("Error checking git status:", error);
    throw error;
  }
}

export async function execPromisify(command, options = {}) {
  const defaultOptions = { env: { ...process.env, GIT_EDITOR: "echo" } };
  const finalOptions = { ...defaultOptions, ...options };

  return new Promise((resolve, reject) => {
    exec(command, finalOptions, (error, stdout, stderr) => {
      if (error) {
        reject(
          new Error(
            `Error executing '${command}': ${error.message}, Stderr: ${stderr}`,
          ),
        );
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

export async function checkForConflicts() {
  return new Promise((resolve, reject) => {
    exec("git diff --name-only --diff-filter=U", (error, stdout, stderr) => {
      if (error) {
        console.error(
          chalk.red(`Error checking for conflicts: ${error.message}`),
        );
        reject(new Error(`Error checking for conflicts: ${error.message}`));
        return;
      }
      if (stderr) {
        console.error(chalk.red(`Error: ${stderr}`));
        reject(new Error(stderr));
        return;
      }
      if (stdout.trim()) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

export async function checkIfBranchIsUpToDate() {
  try {
    await execPromisify("git fetch");

    const { stdout: localHead } = await execPromisify("git rev-parse HEAD");

    const { stdout: remoteHead } = await execPromisify(
      "git ls-remote origin HEAD",
    );
    const remoteHeadHash = remoteHead.split("\t")[0];

    // console.log(`Local HEAD hash: ${localHead.trim()}`);
    // console.log(`Remote HEAD hash: ${remoteHeadHash.trim()}`);

    if (localHead.trim() === remoteHeadHash.trim()) {
      console.log(chalk.green("Branch is up to date with remote."));
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    return false;
  }
}

export async function hasUnresolvedConflicts() {
  const { stdout } = await execPromisify(
    "git diff --name-only --diff-filter=U",
  );

  if (!stdout) {
    return false;
  }
  const files = stdout.split("\n").filter((line) => line.trim() !== "");
  for (let file of files) {
    if (await checkForConflictMarkers(file)) {
      return true;
    }
  }
  return false;
}

export async function checkForConflictMarkers(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf8");

    const conflictMarkerRegex = /^(<<<<<<< |=======|>>>>>>> )/m;

    return conflictMarkerRegex.test(content);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return false;
  }
}

export async function getGitBranches() {
  try {
    const { stdout } = await execPromisify("git branch");
    const branches = stdout
      .split("\n")
      .map((line) => line.replace("*", "").trim())
      .filter(Boolean);
    return branches;
  } catch (error) {
    console.error("Failed to fetch Git branches:", error);
    return [];
  }
}

export function checkRemoteRepositoryExists() {
  try {
    const result = execSync("git remote", { stdio: "pipe" }).toString().trim();
    return result.length > 0;
  } catch (error) {
    return false;
  }
}

export function isGitUserConfigured() {
  try {
    const name = execSync("git config user.name", { stdio: "pipe" })
      .toString()
      .trim();
    const email = execSync("git config user.email", { stdio: "pipe" })
      .toString()
      .trim();
    return Boolean(name) && Boolean(email);
  } catch (error) {
    return false;
  }
}

export async function checkPermissions() {
  try {
    await execPromisify("git push --dry-run");
    return true;
  } catch (error) {
    const errorMessage = error.toString();
    if (
      errorMessage.includes("Permission to") &&
      errorMessage.includes("denied")
    ) {
      return false;
    } else {
      throw new Error("Failed to check permissions: " + errorMessage);
    }
  }
}
