/* eslint-disable no-var */
import type { FrameworkConfig } from "@lib/types";
import type { WebDriver } from "selenium-webdriver";

export interface TestModuleRuntimeInfo {
  type: "test";
  name: string;
  baseDir: string;
  srcDir: string;
  outputDir: string;
  assetDir: string;
}

export interface TestRuntimeInfo {
  groups: string[];
  testPath: string;
}

declare global {
  var __MODULE_INFO: TestModuleRuntimeInfo;
  var __TEST_INFO: TestRuntimeInfo;
  var __FRAMEWORK_CONFIG: FrameworkConfig.All;
  // will only available when using the test is part of the "selenium" group
  // or @selenium is defined in the test docblock
  var webDriver: WebDriver;
}
