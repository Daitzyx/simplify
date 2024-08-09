import inquirer from "inquirer";

export async function askUserConfigOrList() {
  const questions = [
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        { name: "Configure git user", value: "configure" },
        { name: "Show configured user", value: "list" },
      ],
    },
  ];

  const answers = await inquirer.prompt(questions);
  return answers.action;
}

export async function askGitUserName() {
  const { username } = await inquirer.prompt({
    name: "username",
    type: "input",
    message: "Enter your Git username:",
  });

  return username;
}

export async function askGitUserEmail() {
  const { email } = await inquirer.prompt({
    name: "email",
    type: "input",
    message: "Enter your Git email:",
  });

  return email;
}
