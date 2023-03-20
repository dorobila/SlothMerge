import { execa } from "execa";
import ora from "ora";
import chalk from "chalk";
import { renderTitle } from "./utils/renderTitle.js";

renderTitle();

type branches = "develop" | "staging";

async function checkoutAndPull(branch: branches) {
  const spinner = ora(
    `${chalk.cyan(`Checking out to ${branch} branch`)}`,
  ).start();

  try {
    await execa("git", ["checkout", branch]);

    spinner.text = "Pulling latest changes";

    await execa("git", ["pull", branch]);

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

await checkoutAndPull("develop");
