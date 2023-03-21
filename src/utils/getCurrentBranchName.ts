import { execa } from "execa";
import chalk from "chalk";
import ora from "ora";

/**
 * Checks if the current working directory is inside a git repository.
 *
 * @returns {Promise<boolean>} - A Promise that resolves to true if the current working directory is
 *          inside a git repository, otherwise false.
 */
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

/**
 * Checks if the current git repository is valid.
 *
 * @returns {Promise<boolean>} - A Promise that resolves to true if the current git repository is
 *          valid, otherwise false.
 */
async function isGitRepoValid(): Promise<boolean> {
  try {
    await execa("git", ["rev-parse", "--quiet", "--verify", "HEAD"]);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Gets the name of the current branch.
 *
 * @returns {Promise<string>} - A Promise that resolves to a string representing the name of the
 *          current branch. If the current working directory is not inside a git repository, or if
 *          the repository is invalid, the Promise resolves to an empty string. If the current
 *          branch does not start with "bugfix/" or "project/", prompts the user to switch to a
 *          branch that does.
 */
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
