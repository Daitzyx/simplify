import chalk from "chalk";

import { handleGitOperations } from "./git/index.js";
import { setupGitShortcuts } from "./git/shortcut.js";
import {
  checkRemoteRepositoryExists,
  isGitUserConfigured,
} from "../utils/gitUtils.js";

export function setupGitCommand(program) {
  if (!isGitUserConfigured()) {
    console.error(
      chalk.red(
        "Ops: Git user is not configured. Please configure your Git user settings.",
      ),
    );
    return;
  }

  if (!checkRemoteRepositoryExists()) {
    console.error(
      chalk.red(
        "Ops: No remote repository connected. Please add a remote repository before proceeding.",
      ),
    );
    return;
  }

  program
    .command("git")
    .description("Git operations")
    .action(handleGitOperations);

  setupGitShortcuts(program);
}
