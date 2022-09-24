import type Config from "./config";
import type { WebDriver } from "@types/selenium-webdriver";
export * from "./modules/chrome-version";

export interface ModuleRuntimeInfo {
  type: "lib" | "test";
  name: string;
  srcDir: string;
  outputDir: string;
}

export interface TestRuntimeInfo {
  groups: string[];
  testPath: string;
}

declare global {
  var __MODULE_DIR: string;
  var __MODULE_INFO: ModuleRuntimeInfo;
  var __TEST_INFO: TestRuntimeInfo;
  var config: Config.Config;
  // will only available when using the test is part of the "selenium" group
  // or @selenium is defined in the test docblock
  var webDriver: WebDriver;
}

export {};
