import chalk from "chalk";
import { execPromisify } from "../../utils/gitUtils.js";
import { askGitUserName, askGitUserEmail, askUserConfigOrList } from "../../prompts/userConfigPrompt.js";

export async function handleGitConfig() {
  const action = await askUserConfigOrList();

  if (action === "configure") {
    await handleGitUserConfig();
  } else if (action === "list") {
    await handleGitUserList();
  }
}

export async function handleGitUserConfig() {
  const username = await askGitUserName();
  const email = await askGitUserEmail();

  if (!username || !email) {
    console.log("Configuration aborted.");
    process.exit(1);
  }

  try {
    const { stdout, stderr } = await execPromisify(`git config --global user.name "${username}"`);
    console.log(stdout)
    console.log(stderr)
    await execPromisify(`git config --global user.email "${email}"`);
    console.log("Git user configured successfully.");
  } catch (error) {
    console.error("Failed to configure Git user:", error);
  }
}

export async function handleGitUserList() {
  try {
    const username = await execPromisify("git config --global user.name");
    const email = await execPromisify("git config --global user.email");

    console.log(`Git User Name: ${chalk.green(username.stdout.trim())}`);
    console.log(`Git User Email: ${chalk.green(email.stdout.trim())}`);
  } catch (error) {
    console.error("Failed to retrieve Git user configuration:", error);
  }
}
