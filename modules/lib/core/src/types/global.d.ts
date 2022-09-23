import type Config from "./config";
import type { WebDriver } from "@types/selenium-webdriver";
export * from "./modules/chrome-version";

export interface ModuleRuntimeInfo {
  type: "lib" | "test";
  name: string;
  logDir: string;
  failedScreenShotDir: string;
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
  // only available when using an selenium enviornment
  var webDriver: WebDriver;
}

export {};
