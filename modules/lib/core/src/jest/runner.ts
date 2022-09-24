import { Config } from "@jest/types";
import JestTestRunner from "jest-runner";
import { Test } from "@jest/test-result";
import { TestWatcher } from "jest-watcher";

import type { TestRunnerOptions, TestRunnerContext } from "jest-runner";

import { getTestPragmas, getGroupFromPragmas, consoleInfo } from "../utils";
import { ENV_GROUP_FILTER } from "../const";
import {
  validateChromeDriver,
  validateEdgeDriver,
  overrideWebDriverDirFromConfig,
} from "../selenium";

// https://jestjs.io/docs/configuration#runner-string
class CoreRunner extends JestTestRunner {
  constructor(config: Config.GlobalConfig, context: TestRunnerContext) {
    super(config, context);
  }

  getGroupsFromArgs() {
    return process.env[ENV_GROUP_FILTER]?.split(" ") || [];
  }

  getFilteredTests(tests: Array<Test>): Array<Test> {
    const filterGroups = this.getGroupsFromArgs();
    if (filterGroups.length === 0) return tests;

    const targetTests: Array<Test> = [];
    tests.forEach((test) => {
      const testAssignedGroup = getGroupFromPragmas(getTestPragmas(test.path));
      if (testAssignedGroup.some((group) => filterGroups.includes(group))) {
        targetTests.push(test);
      }
    });

    consoleInfo(
      "(GROUP) Filtered tests: " +
        targetTests.reduce((prev, curr) => `${prev}\n${curr.path}`, "")
    );
    return targetTests;
  }

  override async runTests(
    tests: Array<Test>,
    watcher: TestWatcher,
    options: TestRunnerOptions
  ): Promise<void> {
    const targetTests = this.getFilteredTests(tests);

    if (!overrideWebDriverDirFromConfig()) {
      // validate/modify selenium webdrivers
      await validateChromeDriver();
      await validateEdgeDriver();
    }

    return await super.runTests(targetTests, watcher, options);
  }
}

export default CoreRunner;
