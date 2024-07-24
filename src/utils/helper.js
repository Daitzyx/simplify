import fs from "fs";

export function updateStatus(message, isPermanent = false) {
  if (isPermanent) {
    process.stdout.write("\n" + message + "\n");
  } else {
    process.stdout.write("\r\x1b[K" + message);
  }
}

export async function processFiles(files) {
  const validFiles = [];
  for (const file of files) {
    try {
      const stats = fs.statSync(file);
      if (stats.isDirectory()) {
        validFiles.push(...getFilesFromDirectory(file));
      } else if (stats.isFile() && stats.size > 0) {
        validFiles.push(file);
      }
    } catch (error) {
      if (error.code === "ENOENT") {
        validFiles.push(file);
      } else {
        console.error(`Error accessing file ${file}:`, error.message);
      }
    }
  }
  return validFiles;
}

function getFilesFromDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = `${dir}/${entry.name}`;
    if (entry.isDirectory()) {
      files.push(...getFilesFromDirectory(entryPath));
    } else {
      files.push(entryPath);
    }
  }
  return files;
}
