import fs from "fs";
import path from "path";
import { FrameworkConfig } from "@lib/types";

export const overrideWebDriverDirFromConfig = (
  seleniumConfig: FrameworkConfig.SeleniumConfig
) => {
  if (
    seleniumConfig.webDriversDir &&
    seleniumConfig.webDriversDir.length !== 0 &&
    fs.existsSync(seleniumConfig.webDriversDir)
  ) {
    process.env["PATH"] =
      seleniumConfig.webDriversDir +
      path.delimiter +
      (process.env["PATH"] || "");
    return true;
  }
  return false;
};

export * from "./builder";
export * from "./chromedriver";
export * from "./msedgedriver";
