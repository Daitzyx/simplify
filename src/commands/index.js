
import { handleGitOperations } from "./git/index.js";
import { setupGitShortcuts } from "./git/shortcut.js";
import { validateEnvironment } from "../validation/gitvalidation.js";

export function setupGitCommand(program) {
  program
    .command("git")
    .description("Git operations")
    .action((...args) => {
      validateEnvironment("git");
      handleGitOperations(...args);
    });

  setupGitShortcuts(program);
}
