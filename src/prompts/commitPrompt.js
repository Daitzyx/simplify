import inquirer from "inquirer";
import { getCommitTypes } from "../utils/configManager.js";

export async function chooseCommitType() {
  const commitTypes = getCommitTypes();

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
