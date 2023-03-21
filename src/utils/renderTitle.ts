import gradient from "gradient-string";
import { titleString } from "~/consts.js";

const poimandresTheme = {
  blue: "#add7ff",
  cyan: "#89ddff",
  green: "#5de4c7",
  magenta: "#fae4fc",
  red: "#d0679d",
  yellow: "#fffac2",
};

/**
 * Renders the title of the application to the console.
 *
 * @returns {void} - Returns nothing, as this function only logs to the console.
 */
export const renderTitle = () => {
  const slothMerge = gradient(Object.values(poimandresTheme));

  console.log(slothMerge.multiline(titleString));
};
