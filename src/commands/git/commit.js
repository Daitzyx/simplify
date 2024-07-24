import chalk from "chalk";

import {
  checkForUncommittedChanges,
  getFilesWithChanges,
  execPromisify,
  checkForStagedChanges,
} from "../../utils/gitUtils.js";
import {
  askIfAddAllFilesOrSomeOfThem,
  addingFilesToStaged,
  askCommitDirectly,
} from "../../prompts/gitPrompt.js";
import { chooseCommitType } from "../../prompts/commitPrompt.js";
import { updateStatus } from "../../utils/helper.js";

export async function handleGitCommit() {
  const commitChanges = await checkForUncommittedChanges();
  if (!commitChanges) {
    console.log(chalk.green("Nothing to commit!"));
    return;
  }

  const stagedChanges = await checkForStagedChanges();

  let askWhatFileCommit;

  const filesWithChanges = await getFilesWithChanges();
  if (filesWithChanges.length === 0) {
    updateStatus("Nothing to commit!");
    return;
  }

  if (filesWithChanges.length === 1) {
    // spinner.stop("Only one file changed. Adding directly to staged...");
    await addFilesToStage(filesWithChanges);
    await performCommit();

    return;
  }

  if (!stagedChanges) {
    askWhatFileCommit = await askIfAddAllFilesOrSomeOfThem();
  } else {
    const commitDirectly = await askCommitDirectly();

    if (filesWithChanges.length === 0) {
      console.log(chalk.green("Nothing to Add!"));
    }

    if (filesWithChanges.length !== 0 || commitDirectly === "commit") {
      await performCommit();
      return;
    } else {
      askWhatFileCommit = await askIfAddAllFilesOrSomeOfThem();
    }
  }

  if (askWhatFileCommit === "choose") {
    const filesToAdd = await addingFilesToStaged(filesWithChanges);
    if (filesToAdd.length === 0) {
      updateStatus("No files were selected for staging.", true);
      return;
    }
    await addFilesToStage(filesToAdd);
  } else if (askWhatFileCommit === "all") {
    await addFilesToStage(filesWithChanges);
  }

  await performCommit();
}

async function addFilesToStage(files) {
  try {
    const { stdout, stderr } = await execPromisify(
      `git add ${files.join(" ")}`,
    );
    if (stderr) {
      console.error("Error adding files to staging:", stderr);
    } else {
      // updateStatus("Files successfully staged:", false, false);
      // spinner.succeed("Files successfully staged:\n");
      // spinner.stop();
      // console.log("Arquivos adicionados ao staged com sucesso:", stdout);
    }
  } catch (error) {
    console.error("Failed to add files to staging:", error);
  }
}

async function performCommit() {
  const { type, message } = await chooseCommitType();
  const commitCommand = `git commit -m "${type}: ${message}"`;

  const finalStagedChanges = await checkForStagedChanges();
  if (!finalStagedChanges) {
    updateStatus(chalk.yellow("No files to commit after staging."));
    return;
  }

  try {
    const { stdout } = await execPromisify(commitCommand);
    console.log("Commit successful:", stdout);
  } catch (error) {
    console.error("Error performing the commit:", error);
  }
}
