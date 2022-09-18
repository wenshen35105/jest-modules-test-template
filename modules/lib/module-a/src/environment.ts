import SeleniumEnvironment from "@lib/jest/src/environments/selenium";

import type {
  JestEnvironmentConfig,
  EnvironmentContext,
} from "@jest/environment";
import { Context } from "vm";
import { WebDriver } from "selenium-webdriver";

import { getPlatformConfig } from "@lib/core/src/config";

class ModuleASeleniumEnvironment extends SeleniumEnvironment {
  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
  }

  override async setup(): Promise<void> {
    await super.setup();

    const webDriver = this.global.webDriver as WebDriver;
    const platformConfig = getPlatformConfig();

    await webDriver.get(
      `${platformConfig.schema}://${platformConfig.host}:${platformConfig.port}`
    );
    return Promise.resolve();
  }

  override async teardown(): Promise<void> {
    await super.teardown();
    return Promise.resolve();
  }

  override getVmContext(): Context {
    return super.getVmContext() || {};
  }
}

export default ModuleASeleniumEnvironment;
