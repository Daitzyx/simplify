import inquirer from "inquirer";

export async function selectGitOperation() {
  return await inquirer.prompt([
    {
      type: "list",
      name: "operation",
      message: "Select the Git operation:",
      choices: ["commit", "pull", "push", "commit & push", "switch branch"],
    },
  ]);
}

export async function askIfAddAllFilesOrSomeOfThem() {
  const { action } = await inquirer.prompt({
    name: "action",
    type: "list",
    message: "Do you want to add all files?",
    choices: [
      { name: "Yes", value: "all" },
      { name: "No", value: "choose" },
    ],
  });

  return action;
}

export async function addingFilesToStaged(files) {
  const { selectedFiles } = await inquirer.prompt({
    name: "selectedFiles",
    type: "checkbox",
    message: "Select files you want to commit:",
    choices: files,
  });

  return selectedFiles;
}

export async function askCommitDirectly() {
  const { action } = await inquirer.prompt({
    name: "action",
    type: "list",
    message:
      "Staged files detected, do you want to commit directly or add more first?",
    choices: [
      { name: "Commit", value: "commit" },
      { name: "Add more", value: "add" },
    ],
  });

  return action;
}
