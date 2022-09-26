/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Config } from "@jest/types";
import { initTestModuleDirs } from "../utils";

// https://jestjs.io/docs/configuration#globalsetup-string
const globalSetup = (
  _globalConfig: Config.GlobalConfig,
  _projectConfig: Config.ProjectConfig
) => {
  initTestModuleDirs();
};

export default globalSetup;
