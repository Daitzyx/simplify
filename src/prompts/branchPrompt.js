import inquirer from "inquirer";

export async function askBranchToSwitch(branches) {
  const { branch } = await inquirer.prompt([
    {
      type: "list",
      name: "branch",
      message: "Select a branch to switch to:",
      choices: branches,
    },
  ]);
  return branch;
}
