import { Config } from "@jest/types";
import JestTestRunner from "jest-runner";
import type { TestRunnerOptions, TestRunnerContext } from "jest-runner";
import { Test } from "@jest/test-result";
import { TestWatcher } from "jest-watcher";

import { getTestPragmas, getGroupFromPragmas } from "../../utils";
import { CLI_GROUP_PREFIX } from "../../const";

class CoreRunner extends JestTestRunner {
  constructor(config: Config.GlobalConfig, context: TestRunnerContext) {
    super(config, context);
  }

  getGroupsFromArgs() {
    const groups: string[] = [];
    (process.argv || []).forEach((argv) => {
      if (!argv.startsWith(CLI_GROUP_PREFIX)) return;
      groups.push(argv.split(CLI_GROUP_PREFIX)[1]);
    });
    return groups;
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

    console.log("Target groups: " + targetTests.toString());
    return targetTests;
  }

  override async runTests(
    tests: Array<Test>,
    watcher: TestWatcher,
    options: TestRunnerOptions
  ): Promise<void> {
    const targetTests = this.getFilteredTests(tests);

    return await super.runTests(targetTests, watcher, options);
  }
}

export default CoreRunner;
