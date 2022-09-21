import NodeEnvironment from "jest-environment-node";

import type {
  JestEnvironmentConfig,
  EnvironmentContext,
} from "@jest/environment";
import type { Event, State } from "jest-circus";
import { Context } from "vm";
import { getConfig } from "../config";
import { buildWebDriver } from "../selenium";

class CoreEnvironment extends NodeEnvironment {
  jestConfig!: JestEnvironmentConfig;
  environmentContext!: EnvironmentContext;

  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
    this.jestConfig = config;
    this.environmentContext = context;
  }

  override async setup(): Promise<void> {
    await super.setup();

    this.global.config = getConfig();
    return Promise.resolve();
  }

  override async teardown(): Promise<void> {
    await super.teardown();
    return Promise.resolve();
  }

  override getVmContext(): Context {
    return super.getVmContext() || {};
  }

  async handleTestEvent(event: Event, state: State) {
    if (event.name === "test_start") {
      if (
        state.rootDescribeBlock?.children?.[0]?.name.startsWith("<selenium>")
      ) {
        this.global.webDriver = await buildWebDriver();
      }
    } else if (event.name === "test_done") {
      if (this.global.webDriver) {
        try {
          await this.global.webDriver.quit();
        } catch (e) {
          console.log("Failed to quit webdriver");
        }
      }
    }
    await Promise.resolve();
  }
}

export default CoreEnvironment;
