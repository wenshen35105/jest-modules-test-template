import { PragmaSeleniumConfig } from "../types/pragma";
import { getTestPragmas, getSeleniumConfigFromPragmas } from "../utils";

export const getSeleniumConfigForTest = (
  pathToTest: string
): PragmaSeleniumConfig | undefined => {
  return getSeleniumConfigFromPragmas(getTestPragmas(pathToTest));
};
