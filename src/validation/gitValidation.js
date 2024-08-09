import fs from "fs";
import chalk from "chalk";
import { checkRemoteRepositoryExists, isGitUserConfigured } from "../utils/gitUtils.js";

export async function filterNonEmptyFiles(files) {
  const filteredFiles = files.filter((file) => {
    try {
      const stats = fs.statSync(file);
      return stats.isDirectory() || (stats.isFile() && stats.size > 0);
    } catch (error) {
      console.error(`Error accessing file ${file}:`, error.message);
      return false;
    }
  });
  return filteredFiles;
}

export function validateUnstagedChanges(lines) {
  const unstagedLines = lines.filter(
    (line) =>
      line &&
      !line.startsWith("A ") &&
      !line.startsWith("M ") &&
      !line.startsWith("D ") &&
      !line.startsWith("R "),
  );

  if (unstagedLines.length > 0) {
    unstagedLines.forEach((line) => {
      console.error(chalk.red(`Unstaged change: ${line}`));
    });
    throw new Error("Not all changes are staged.");
  }
}

export function validateGitUserConfig() {
  if (!isGitUserConfigured()) {
    console.error(
      chalk.red(
        "Ops: Git user is not configured. Please configure your Git user settings.",
      ),
    );
    process.exit(1);
  }
}

export function validateRemoteRepository() {
  if (!checkRemoteRepositoryExists()) {
    console.error(
      chalk.red(
        "Ops: No remote repository connected. Please add a remote repository before proceeding.",
      ),
    );
    process.exit(1);
  }
}

export function validateEnvironment(commandName) {
  if (commandName !== "user") {
    validateRemoteRepository();
    validateGitUserConfig();
  }
}