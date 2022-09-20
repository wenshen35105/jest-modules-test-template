import type {
  JestEnvironmentConfig,
  EnvironmentContext,
} from "@jest/environment";
import { Context } from "vm";
import { WebDriver } from "selenium-webdriver";
import { buildWebDriver } from "../../selenium";
import BaseEnvironment from "./base";

class SeleniumEnvironment extends BaseEnvironment {
  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
  }

  override async setup(): Promise<void> {
    await super.setup();

    const webDriver = await buildWebDriver();
    this.global.webDriver = webDriver;
    return Promise.resolve();
  }

  override async teardown(): Promise<void> {
    await super.teardown();

    if (this.global.webDriver) {
      await (this.global.webDriver as WebDriver).quit();
    }
    return Promise.resolve();
  }

  override getVmContext(): Context {
    return super.getVmContext() || {};
  }
}

export default SeleniumEnvironment;
