import { validateEnvironment } from "../../validation/gitvalidation.js";
import { handleGitSwitchBranch } from "./branch.js";
import { handleGitCommit } from "./commit.js";
import { handleGitPull } from "./pull.js";
import { handleGitPush } from "./push.js";
import { handleGitConfig, handleGitUserConfig, handleGitUserList } from "./userConfig.js";

export function setupGitShortcuts(program) {
  program
    .command("c")
    .aliases(["commit"])
    .description("Record changes to the repository")
    .action((options) => {
      validateEnvironment("commit");
      handleGitCommit(options.message);
    });

  program
    .command("p")
    .aliases(["pull"])
    .description(
      "Fetch from and integrate with another repository or a local branch",
    )
    .action(() => {
      validateEnvironment("pull");
      handleGitPull();
    });

  program
    .command("ph")
    .aliases(["push"])
    .description("Pull changes from remote & Update to remote the news")
    .action(() => {
      validateEnvironment("push");
      handleGitPush();
    });

  program
    .command("cp")
    .aliases(["commit-push"])
    .description(
      "Record changes to the repository and push them to a remote repository",
    )
    .action(async (options) => {
      validateEnvironment("commit-push");
      await handleGitCommit(options.message);
      await handleGitPush();
    });

  program
    .command("sb")
    .aliases(["switch-branch"])
    .description("Switch branches or restore working tree files")
    .action(() => {
      validateEnvironment("switch-branch");
      handleGitSwitchBranch();
    });

  program
    .command("user")
    .description("Configure or list git user")
    .option("--list", "List current git user configuration")
    .option("--conf", "Configure new git user")
    .action((options) => {
      if (options.list) {
        handleGitUserList();
      } else if (options.conf) {
        handleGitUserConfig();
      } else {
        handleGitConfig();
      }
    });
}
