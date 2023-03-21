import chalk from "chalk";
import { execa } from "execa";
import ora from "ora";
import { type branches } from "~/index.js";

/**
 * Checks out the specified branch and pulls the latest changes from it. Merges the current working
 * branch with the specified branch. Pushes the merged changes into the specified branch.
 *
 * @param {string} currentBranchName - Name of the current working branch.
 * @param {string} branch - Branch to merge changes into. Can be "develop", "staging", or "both".
 * @returns {void} - Returns nothing.
 */
export async function checkoutAndPull(
  currentBranchName: string,
  branch: branches,
) {
  let targetBranches: branches[];
  if (branch === "both") {
    targetBranches = ["develop", "staging"];
  } else {
    targetBranches = [branch];
  }

  const spinner = ora(
    `${chalk.cyan(
      `Checking out, pulling and merging latest changes from ${currentBranchName} to ${targetBranches.join(
        ", ",
      )} branches`,
    )}`,
  ).start();

  try {
    for (const targetBranch of targetBranches) {
      await execa("git", ["checkout", targetBranch]);
      spinner.text = chalk.cyan(
        `Pulling latest changes from ${targetBranch} branch`,
      );
      await execa("git", ["pull"]);

      spinner.text = chalk.cyan(
        `Merging ${currentBranchName} branch into ${targetBranch} branch`,
      );
      await execa("git", [
        "merge",
        currentBranchName,
        "-m",
        `Merge branch '${currentBranchName}' into ${targetBranch} sloth style`,
      ]);

      await execa("git", ["push"]);
      spinner.text = chalk.cyan(
        `Pushing ${currentBranchName} branch into ${targetBranch} branch`,
      );
    }

    spinner.succeed(
      `${chalk.green(
        `Finished merging changes from ${currentBranchName} to ${targetBranches.join(
          ", ",
        )} branches`,
      )}`,
    );
  } catch (err) {
    if (err instanceof Error) {
      spinner.fail(`Error: ${err}`);
      process.exit(1);
    } else {
      throw err;
    }
  }
}
