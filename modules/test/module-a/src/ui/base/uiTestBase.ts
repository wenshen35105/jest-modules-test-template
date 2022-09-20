import SeleniumEnvironment from "@lib/core/src/jest/environments/selenium";

import type {
  JestEnvironmentConfig,
  EnvironmentContext,
} from "@jest/environment";
import { Context } from "vm";

class ModuleASeleniumEnvironment extends SeleniumEnvironment {
  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
  }

  override async setup(): Promise<void> {
    await super.setup();

    await this.global.webDriver.get(this.global.config.platform.url.toString());

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
