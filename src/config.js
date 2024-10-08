import fs from "fs";
import path from "path";
import { checkBranchProtection, getCurrentBranch } from "./utils/gitUtils.js";

function loadConfig(configFileName = 'simplify.config.json') {
  const configPath = path.resolve(process.cwd(), configFileName);

  if (fs.existsSync(configPath)) {
    const configData = fs.readFileSync(configPath, 'utf-8').trim();

    if (configData === '' || configData === '{}') {
      return {
        branchProtection: {
          enabled: false,
          protectedBranches: [],
        },
      };
    }

    return JSON.parse(configData);
  }

  return {
    branchProtection: {
      enabled: false,
      protectedBranches: [],
    },
  };
}

export function protectBranch() {
  const config = loadConfig();
  const currentBranch = getCurrentBranch();

  if (config.branchProtection.enabled) {
    if (checkBranchProtection(currentBranch, config.branchProtection.protectedBranches)) {
      console.error(`Branch "${currentBranch}" is protected. Direct commits are not allowed.`);
      process.exit(1);
    }
  }
}
