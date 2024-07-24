import inquirer from "inquirer";

const commitTypes = [
  { name: "Refactor", value: "refactor" },
  { name: "Feature", value: "feat" },
  { name: "Fix", value: "fix" },
  { name: "Style", value: "style" },
  { name: "Chore", value: "chore" },
  { name: "Test", value: "test" },
];

export async function chooseCommitType() {
  return await inquirer.prompt([
    {
      type: "list",
      name: "type",
      message: "Select the type of change that you're committing:",
      choices: commitTypes,
    },
    {
      type: "input",
      name: "message",
      message: "Enter the commit message:",
      validate: (input) =>
        input.trim() !== "" ? true : "Commit message cannot be empty.",
    },
  ]);
}
