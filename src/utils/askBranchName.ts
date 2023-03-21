import inquirer from "inquirer";

/**
 * Asks the user to select a branch name where they want to merge their changes.
 *
 * @returns {Promise<string>} - A Promise that resolves to a string representing the selected
 *          destination branch name.
 */

export async function askBranchName(): Promise<string> {
  const { branch } = await inquirer.prompt([
    {
      type: "list",
      name: "branch",
      message: "Which branch do you want to merge your changes into?",
      choices: ["develop", "staging", "both"],
    },
  ]);

  return branch;
}
