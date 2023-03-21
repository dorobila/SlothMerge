import chalk from "chalk";
import { execa } from "execa";
import ora from "ora";

type branches = "develop" | "staging";

export async function checkoutAndPull(branch: branches) {
  const spinner = ora(
    `${chalk.cyan(`Checking out to ${branch} branch`)}`,
  ).start();

  try {
    await execa("git", ["checkout", branch]);

    spinner.text = chalk.cyan(`Pulling latest changes from ${branch} branch`);

    await execa("git", ["pull"]);

    spinner.succeed(
      `${chalk.green(
        `Finished checking out and pulling changes from ${branch} branch`,
      )}`,
    );
  } catch (err) {
    if (err instanceof Error) {
      spinner.fail(`Error: ${err}`);
    } else {
      throw err;
    }
  }
}
