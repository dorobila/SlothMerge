#! /usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import { getCurrentBranchName } from "~/utils/getCurrentBranchName.js";
import { renderTitle } from "~/utils/renderTitle.js";
import { checkoutAndPull } from "~/utils/checkoutAndPull.js";
import { askBranchName } from "~/utils/askBranchName.js";

export type branches = "develop" | "staging" | "both";

async function main(): Promise<void> {
  renderTitle();

  const branchToMerge = (await askBranchName()) as branches;
  const currentBranchName = await getCurrentBranchName();
  console.log(`You chose to merge changes into: ${chalk.green(branchToMerge)}`);

  const { isCurrentBranch } = await inquirer.prompt([
    {
      type: "confirm",
      name: "isCurrentBranch",
      message: `Are you sure you want to merge ${chalk.green(
        currentBranchName,
      )} into ${chalk.green(branchToMerge)}?`,
    },
  ]);

  if (!isCurrentBranch) {
    console.log(
      `Please switch to the correct branch name before merging changes.`,
    );
    process.exit(1);
  }

  await checkoutAndPull(currentBranchName, branchToMerge);
}

await main().catch((err) => {
  console.log(chalk.red("Aborting installation..."));
  if (err instanceof Error) {
    console.log(chalk.red(err));
  } else {
    console.log(
      chalk.red(
        "An unknown error has occurred. Please open an issue on github with the below:",
      ),
    );
    console.log(err);
  }
  process.exit(1);
});
