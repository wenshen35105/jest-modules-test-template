import NodeEnvironment from "jest-environment-node";

import type {
  JestEnvironmentConfig,
  EnvironmentContext,
} from "@jest/environment";
import { Context } from "vm";
import { Builder, Browser, WebDriver } from "selenium-webdriver";
import { getSeleniumConfig } from "@lib/core/src/config";

class SeleniumEnvironment extends NodeEnvironment {
  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
  }

  async buildWebDriver() {
    const seleniumConfig = getSeleniumConfig();
    let browserType: string;

    if (seleniumConfig.browser === "chrome") {
      browserType = Browser.CHROME;
    } else if (seleniumConfig.browser === "edge") {
      browserType = Browser.EDGE;
    } else {
      browserType = Browser.FIREFOX;
    }

    const driver = await new Builder().forBrowser(browserType).build();
    return driver;
  }

  override async setup(): Promise<void> {
    await super.setup();

    const webDriver = await this.buildWebDriver();
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

  //...

  // async handleTestEvent(event: Event, state: State) {
  //   if (event === "test_start") {
  //     // ...
  //   }
  // }
}

export default SeleniumEnvironment;
