import chalk from "chalk";
import { execa } from "execa";
import ora from "ora";
import { type branches } from "~/index.js";

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
    }

    spinner.succeed(
      `${chalk.green(
        `Finished checking out and pulling changes from ${targetBranches.join(
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
