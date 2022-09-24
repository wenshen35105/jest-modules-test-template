import NodeEnvironment from "jest-environment-node";
import { Context } from "vm";
import fs from "fs";
import path from "path";

import type {
  JestEnvironmentConfig,
  EnvironmentContext,
} from "@jest/environment";
import type { Event } from "jest-circus";
import type { Circus } from "@jest/types";
import type { PragmaSeleniumConfig } from "../types/pragma";

import { getConfig, getSeleniumConfigForTest } from "../config";
import { buildWebDriver, setupWebDriver } from "../selenium";
import {
  getTestModuleInfoForTest,
  getTestInfoForTest,
  resolveRecursiveTestName,
  formatTestNameAsFileName,
  resolveModuleRelativePath,
  MODULE_SRC_DIR,
  MODULE_OUT_DIR,
  consoleInfo,
  consoleError,
} from "../utils";

/**
 * https://jestjs.io/docs/configuration#testenvironment-string
 *
 * lifecycle
 * 1. constructor
 * 2. setup
 * 3. run_start
 * 4. test_start
 * 5. test_done
 * 6. run_finish
 * 7. teardown
 */
class CoreEnvironment extends NodeEnvironment {
  jestConfig!: JestEnvironmentConfig;
  environmentContext!: EnvironmentContext;

  seleniumConfig!: PragmaSeleniumConfig | undefined;

  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
    this.jestConfig = config;
    this.environmentContext = context;
    this.seleniumConfig = undefined;
  }

  override async setup(): Promise<void> {
    await super.setup();

    // inject config
    this.global.config = getConfig();

    // inject module info
    this.global.__MODULE_INFO = getTestModuleInfoForTest(
      this.global.__MODULE_DIR
    );

    // inject test info
    this.global.__TEST_INFO = getTestInfoForTest(
      this.environmentContext.testPath
    );

    // get seleniumConfig
    this.seleniumConfig = getSeleniumConfigForTest(
      this.environmentContext.testPath
    );
  }

  override async teardown(): Promise<void> {
    await super.teardown();
    await this.quitWebDriver();
  }

  override getVmContext(): Context {
    return super.getVmContext() || {};
  }

  async webDriverTakeScreenshot(test: Circus.TestEntry) {
    if (!this.global.webDriver) return Promise.reject("WebDriver not found");

    const testName = resolveRecursiveTestName(test);
    try {
      const screenshotPath = path.resolve(
        resolveModuleRelativePath(
          this.global.__MODULE_DIR,
          this.global.__TEST_INFO.testPath,
          {
            src: MODULE_SRC_DIR,
            dest: MODULE_OUT_DIR,
          },
          "_failedTestScreenshot"
        ),
        formatTestNameAsFileName(
          this.global.__TEST_INFO.testPath,
          testName,
          ".png"
        )
      );
      const screenshotBuf64 = await this.global.webDriver.takeScreenshot();
      return new Promise<void>((resolve, reject) => {
        fs.writeFile(screenshotPath, screenshotBuf64, "base64", (err) => {
          if (err) reject(err);
          consoleInfo(`Screenshot is put to '${screenshotPath}'`);
          resolve();
        });
      });
    } catch (e) {
      consoleError(
        `Failed to save screenshot for '${this.global.__TEST_INFO.testPath}' - '${testName}'`
      );
    }
  }

  async quitWebDriver(): Promise<void> {
    try {
      await this.global?.webDriver?.quit();
      Object.defineProperty(this.global, "webDriver", {});
    } catch (e) {
      consoleError("Failed to quit webDriver");
    }
  }

  async createWebDriver(): Promise<void> {
    if (!this.global.webDriver) {
      this.global.webDriver = await buildWebDriver();
      await setupWebDriver(this.global.webDriver);
    }
  }

  async handleTestEvent(event: Event) {
    if (event.name === "test_start") {
      // start webdriver for "test" scope
      if (this.seleniumConfig?.webDriverCycle === "test") {
        await this.createWebDriver();
      }
    }

    if (event.name === "test_done") {
      // webdriver take screenshot when erros detected
      if (event.test.errors?.length && this.seleniumConfig) {
        consoleInfo("Error noticed, ready to take a screenshot for the test");
        await this.webDriverTakeScreenshot(event.test);
      }
      // quit webdriver for "test" scope
      if (this.seleniumConfig?.webDriverCycle === "test") {
        await this.quitWebDriver();
      }
    }

    if (event.name === "run_start") {
      // start webdriver for "run" scope
      if (this.seleniumConfig?.webDriverCycle === "run") {
        await this.createWebDriver();
      }
    }

    if (event.name === "run_finish") {
      if (this.seleniumConfig?.webDriverCycle === "run") {
        await this.quitWebDriver();
      }
    }
  }
}

export default CoreEnvironment;
