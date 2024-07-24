import { handleGitCommit } from "./commit.js";
import { handleGitPull } from "./pull.js";
import { handleGitPush } from "./push.js";
import { handleGitSwitchBranch } from "./branch.js";
import { selectGitOperation } from "../../prompts/gitPrompt.js";

export async function handleGitOperations() {
  const gitOperation = await selectGitOperation();

  switch (gitOperation.operation) {
    case "commit":
      await handleGitCommit();
      break;
    case "pull":
      await handleGitPull();
      break;
    case "push":
      await handleGitPush();
      break;
    case "commit & push":
      await handleGitCommit();
      await handleGitPush();
      break;
    case "switch branch":
      await handleGitSwitchBranch();
      break;
  }
}
