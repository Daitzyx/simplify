import fs from "fs";
import path from "path";
import { checkBranchProtection, getCurrentBranch } from "./utils/gitUtils.js";

function loadConfig() {
  const configPath = path.resolve(process.cwd(), 'simplify.config.json');

  if (fs.existsSync(configPath)) {
    const configData = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(configData);
  } else {
    return {
      branchProtection: {
        protectedBranches: [],
        requirePullRequest: false
      }
    };
  }
}

export function protectBranch() {
  const config = loadConfig();
  const currentBranch = getCurrentBranch();

  if (checkBranchProtection(currentBranch, config.protectedBranches.branches)) {
    if (config.protectedBranches) {
      console.error(`Branch "${currentBranch}" is protected. Direct commits are not allowed.`);
      process.exit(1);
    }
  }
}