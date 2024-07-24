import fs from "fs";

export async function filterNonEmptyFiles(files) {
  const filteredFiles = files.filter((file) => {
    try {
      const stats = fs.statSync(file);
      return stats.isDirectory() || (stats.isFile() && stats.size > 0);
    } catch (error) {
      console.error(`Error accessing file ${file}:`, error.message);
      return false;
    }
  });
  return filteredFiles;
}

export function validateUnstagedChanges(lines) {
  const unstagedLines = lines.filter(
    (line) =>
      line &&
      !line.startsWith("A ") &&
      !line.startsWith("M ") &&
      !line.startsWith("D ") &&
      !line.startsWith("R "),
  );

  if (unstagedLines.length > 0) {
    unstagedLines.forEach((line) => {
      console.error(chalk.red(`Unstaged change: ${line}`));
    });
    throw new Error("Not all changes are staged.");
  }
}
