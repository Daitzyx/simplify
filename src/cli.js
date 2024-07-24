#!/usr/bin/env node
import figlet from "figlet";
import chalk from "chalk";

import { program } from "commander";

import { setupGitCommand } from "./commands/index.js";

try {
  console.log(
    chalk.blue(figlet.textSync("Simplify", { horizontalLayout: "full" })),
  );
} catch (error) {
  console.error(
    chalk.red("Failed to initialize CLI display: " + error.message),
  );
}

program
  .name("simplify")
  .alias("simp")
  .description("Let's make all easy!")
  .version("1.0.0");

setupGitCommand(program);

// program.description("Operations:").addHelpText(
//   "after",
//   `
// Operations:
//   Start a working area:
//     clone       Clone a repository into a new directory
//     init        Create an empty Git repository or reinitialize an existing one

//   Work on the current change:
//     add         Add file contents to the index
//     commit      Record changes to the repository
//     push        Update remote refs along with associated objects
//     switch      Switch branches or restore working tree files

//   Examine the history and state:
//     log         Show commit logs
//     status      Show the working tree status

//   Grow, mark and tweak your common history:
//     merge       Join two or more development histories together
//     rebase      Reapply commits on top of another base tip
//     tag         Create, list, delete or verify a tag object signed with GPG
// `,
// );

program.parse(process.argv);
