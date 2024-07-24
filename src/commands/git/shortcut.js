import { handleGitSwitchBranch } from "./branch.js";
import { handleGitCommit } from "./commit.js";
import { handleGitPull } from "./pull.js";
import { handleGitPush } from "./push.js";

export function setupGitShortcuts(program) {
  program
    .command("c")
    .aliases(["commit"])
    .description("Record changes to the repository")
    .action((options) => {
      handleGitCommit(options.message);
    });

  program
    .command("p")
    .aliases(["pull"])
    .description(
      "Fetch from and integrate with another repository or a local branch",
    )
    .action(() => {
      handleGitPull();
    });

  program
    .command("ph")
    .aliases(["push"])
    .description("Pull changes from remote & Update to remote the news")
    .action(() => {
      handleGitPush();
    });

  program
    .command("cp")
    .aliases(["commit-push"])
    .description(
      "Record changes to the repository and push them to a remote repository",
    )
    .action(async (options) => {
      await handleGitCommit(options.message);
      await handleGitPush();
    });

  program
    .command("sb")
    .aliases(["switch-branch"])
    .description("Switch branches or restore working tree files")
    .action(() => {
      handleGitSwitchBranch();
    });
}
