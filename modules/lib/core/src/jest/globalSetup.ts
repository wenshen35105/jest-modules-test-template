import type { Config } from "@jest/types";
import { initTestModuleDirs } from "../utils";

// https://jestjs.io/docs/configuration#globalsetup-string
const globalSetup = (
  _: Config.GlobalConfig,
  projectConfig: Config.ProjectConfig
) => {
  initTestModuleDirs(projectConfig.globals.__MODULE_DIR as string);
};

export default globalSetup;
