import inquirer from "inquirer";

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
