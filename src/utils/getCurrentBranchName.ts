import { execa } from "execa";
import chalk from "chalk";
import ora from "ora";

async function isInGitRepo(): Promise<boolean> {
  try {
    const { stdout } = await execa("git", [
      "rev-parse",
      "--is-inside-work-tree",
    ]);
    return stdout.trim() === "true";
  } catch (err) {
    return false;
  }
}

async function isGitRepoValid(): Promise<boolean> {
  try {
    await execa("git", ["rev-parse", "--quiet", "--verify", "HEAD"]);
    return true;
  } catch (err) {
    return false;
  }
}

export async function getCurrentBranchName(): Promise<string> {
  if (!(await isInGitRepo()) || !(await isGitRepoValid())) {
    return "";
  }
  const spinner = ora("Getting current branch name...").start();
  try {
    const { stdout } = await execa("git", ["symbolic-ref", "--short", "HEAD"]);
    const branchName = stdout.trim() === "HEAD" ? "master" : stdout.trim();
    if (branchName.startsWith("bugfix/") || branchName.startsWith("project/")) {
      spinner.succeed(`Current branch: ${chalk.green(branchName)}`);
      return branchName;
    } else {
      spinner.fail(
        `Current branch (${chalk.red(
          branchName,
        )}) does not match required prefix.`,
      );
      const promptMessage = `Please switch to a branch starting with ${chalk.cyan(
        "bugfix/",
      )} or ${chalk.cyan("project/")}.`;
      console.log(chalk.yellow(promptMessage));
      // exit process if branch name does not match required prefix
      process.exit(1);
    }
  } catch (err) {
    spinner.fail("Failed to get current branch name.");
    return "";
  }
}
