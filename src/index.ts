import { renderTitle } from "./utils/renderTitle.js";
import { checkoutAndPull } from "./utils/checkoutAndPull.js";

renderTitle();

await checkoutAndPull("develop");
await checkoutAndPull("staging");
