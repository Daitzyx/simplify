import inquirer from "inquirer";

export async function solveConflictsAutomatic() {
  const { autoResolve } = await inquirer.prompt([
    {
      type: "confirm",
      name: "autoResolve",
      message: "Attempt to automatically resolve conflicts?",
      default: false,
    },
  ]);

  return autoResolve;
}

export async function alreadySolveConflicts() {
  const { action } = await inquirer.prompt({
    name: "action",
    type: "list",
    message: "Have you resolved all conflicts and are ready to continue?",
    choices: [
      {
        name: "Continue (this will try to apply the changes and continue the process)",
        value: "continue",
      },
      {
        name: "Abort (this will discard the changes made during the process)",
        value: "abort",
      },
    ],
  });

  return action;
}
