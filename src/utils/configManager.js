import fs from 'fs';
import path from 'path';
import os from 'os';

const defaultCommitTypes = [
  { name: "Refactor", value: "refactor" },
  { name: "Feature", value: "feat" },
  { name: "Fix", value: "fix" },
  { name: "Style", value: "style" },
  { name: "Chore", value: "chore" },
]

const globalConfigPath = path.resolve(os.homedir(), '.simplifyconfig.json');
const projectConfigPath = path.resolve(process.cwd(), 'simplify.config.json');

const loadConfig = (filePath) => {
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8').trim());
  }

  return null;
};

export function getCommitTypes() {
  const projectConfig = loadConfig(projectConfigPath);
  const globalConfig = loadConfig(globalConfigPath);

  if (projectConfig && Array.isArray(projectConfig.commitTypes) && projectConfig.commitTypes.length > 0) {
    let hasInvalidStructure = false;

    for (const commitType of projectConfig.commitTypes) {
      if (typeof commitType !== 'object' || !commitType.name || !commitType.value) {
        hasInvalidStructure = true;
      }
    }

    if (hasInvalidStructure) {
      console.error("Invalid commit type structure in project config. Each commit type must be an object with 'name' and 'value' keys.");

      if (!globalConfig || !Array.isArray(globalConfig.commitTypes) || globalConfig.commitTypes.length === 0) {
        return defaultCommitTypes;
      }
    }

    return projectConfig.commitTypes;
  }

  if (globalConfig && Array.isArray(globalConfig.commitTypes) && globalConfig.commitTypes.length > 0) {
    return globalConfig.commitTypes;
  }

  return defaultCommitTypes;
}

export function setCommitType(type, prefix) {
  const config = loadConfig(globalConfigPath) || { commitTypes: [] };

  const existingIndex = config.commitTypes.findIndex(item => item.name === type);

  if (existingIndex !== -1) {
    config.commitTypes[existingIndex].prefix = prefix;
  } else {
    config.commitTypes.push({ name: type, value: prefix });
  }

  saveConfig(globalConfigPath, config);
  console.log(`Commit type '${type}' set to prefix '${prefix}' successfully.`);
}

export function removeCommitType(type) {
  const config = loadConfig(globalConfigPath);

  if (!config || !Array.isArray(config.commitTypes)) {
    console.error("No commit types found in global config.");
    return;
  }

  const initialLength = config.commitTypes.length;
  config.commitTypes = config.commitTypes.filter(item => item.name !== type);

  if (config.commitTypes.length === initialLength) {
    console.log(`Commit type '${type}' not found.`);
  } else {
    saveConfig(globalConfigPath, config);
    console.log(`Commit type '${type}' removed successfully.`);
  }
}

const saveConfig = (filePath, config) => {
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf8');
};