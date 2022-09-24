import { parse as parseDocBlock } from "jest-docblock";
import fs from "fs";

import { PRAGMA__GROUP, PRAGMA__SELENIUM } from "../const";

import type { Pragmas, PragmaSeleniumConfig } from "../types/pragma";
import { consoleError } from "./log";

export const getTestPragmas = (pathToTest: string): Pragmas => {
  const pragmas = parseDocBlock(fs.readFileSync(pathToTest, "utf8"));
  return pragmas;
};

export const getGroupFromPragmas = (pragmas: Pragmas): string[] => {
  if (pragmas[PRAGMA__GROUP]) {
    const group = pragmas[PRAGMA__GROUP];
    if (Array.isArray(group)) return group;
    return [group];
  }
  return [];
};

export const getSeleniumConfigFromPragmas = (
  pragmas: Pragmas
): PragmaSeleniumConfig | undefined => {
  let out: PragmaSeleniumConfig | undefined;
  if (getGroupFromPragmas(pragmas).includes(PRAGMA__SELENIUM)) {
    out = {
      webDriverCycle: "test",
    };
  }
  if (pragmas[PRAGMA__SELENIUM] && !Array.isArray(pragmas[PRAGMA__SELENIUM])) {
    try {
      const seleniumConfigBuf = JSON.parse(
        pragmas[PRAGMA__SELENIUM]
      ) as PragmaSeleniumConfig;
      out = {
        webDriverCycle: seleniumConfigBuf.webDriverCycle,
      };
    } catch (e) {
      consoleError("Invalid 'selenium' config in docblock");
      throw e;
    }
  }

  return out;
};
