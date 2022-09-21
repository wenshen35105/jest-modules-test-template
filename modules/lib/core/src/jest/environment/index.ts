import NodeEnvironment from "jest-environment-node";
import { Context } from "vm";

import type {
  JestEnvironmentConfig,
  EnvironmentContext,
} from "@jest/environment";
import type { Event } from "jest-circus";
import type { PragmaSeleniumConfig } from "../../types/pragma";

import { getConfig, getSeleniumConfigForTest } from "../../config";
import { buildWebDriver } from "../../selenium";

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

    // determine if
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

  async quitWebDriver(): Promise<void> {
    try {
      await this.global?.webDriver?.quit();
      Object.defineProperty(this.global, "webDriver", {});
    } catch (e) {
      console.log("Failed to quit webDriver");
    }
  }

  async createWebDriver(): Promise<void> {
    if (!this.global.webDriver) {
      this.global.webDriver = await buildWebDriver();
    }
  }

  async handleTestEvent(event: Event) {
    if (
      event.name === "test_start" &&
      this.seleniumConfig?.webDriverCycle === "test"
    ) {
      await this.createWebDriver();
    }

    if (
      event.name === "test_done" &&
      this.seleniumConfig?.webDriverCycle === "test"
    ) {
      await this.quitWebDriver();
    }

    if (
      event.name === "run_start" &&
      this.seleniumConfig?.webDriverCycle === "run"
    ) {
      await this.createWebDriver();
    }

    if (
      event.name === "run_finish" &&
      this.seleniumConfig?.webDriverCycle === "run"
    ) {
      await this.quitWebDriver();
    }
  }
}

export default CoreEnvironment;
