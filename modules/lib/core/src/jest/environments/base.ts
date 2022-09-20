import NodeEnvironment from "jest-environment-node";

import type {
  JestEnvironmentConfig,
  EnvironmentContext,
} from "@jest/environment";
import { Context } from "vm";
import { getConfig } from "../../config";

class SeleniumEnvironment extends NodeEnvironment {
  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
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
}

export default SeleniumEnvironment;
