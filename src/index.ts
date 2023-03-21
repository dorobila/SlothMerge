import { renderTitle } from "./utils/renderTitle.js";
import { checkoutAndPull } from "./utils/checkoutAndPull.js";
import { getCurrentBranchName } from "./utils/getCurrentBranchName.js";

renderTitle();

await getCurrentBranchName();

await checkoutAndPull("develop");
await checkoutAndPull("staging");
