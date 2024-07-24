import chalk from "chalk";

import {
  execPromisify,
  getGitBranches,
  checkForUncommittedChanges,
  checkForStagedChanges,
} from "../../utils/gitUtils.js";
import { askBranchToSwitch } from "../../prompts/branchPrompt.js";
import { updateStatus } from "../../utils/helper.js";

export async function handleGitSwitchBranch() {
  if (await checkForUncommittedChanges()) {
    console.error(
      chalk.red(
        "Unstaged changes detected. Please commit or stash your changes.",
      ),
    );
    return;
  }

  if (await checkForStagedChanges()) {
    console.error(
      chalk.red("Staged changes detected. Please commit your changes."),
    );
    return;
  }

  const branches = await getGitBranches();
  if (branches.length === 0) {
    console.log("No other branches available to switch to.");
    return;
  }

  const branchToSwitch = await askBranchToSwitch(branches);
  try {
    await execPromisify(`git switch ${branchToSwitch}`);
    updateStatus(`Switched to branch: ${branchToSwitch}`);
  } catch (error) {
    console.error("Failed to switch branch:", error);
  }
}
