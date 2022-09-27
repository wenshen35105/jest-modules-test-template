import path from "path";
import { kebabCase } from "lodash";

import type { Circus } from "@jest/types";

import { getTestPragmas, getGroupFromPragmas } from "./docblock";

import type { TestRuntimeInfo } from "../types/global";

export const getTestInfoForTest = (testPath: string): TestRuntimeInfo => {
  return {
    groups: getGroupFromPragmas(getTestPragmas(testPath)),
    testPath: testPath,
  };
};

export const resolveRecursiveTestName = (
  test: Circus.TestEntry | Circus.DescribeBlock
): string => {
  const output = [test.name];
  while (test.parent) {
    test = test.parent;
    output.push(test.name);
  }
  if (output.length > 1) {
    output.pop();
  }
  return output.reverse().join(" ");
};

export const formatTestNameAsFileName = (
  testPath: string,
  testName: string,
  suffix = ""
) => {
  const outputName = kebabCase(`${path.basename(testPath)}-${testName}`);
  return outputName + suffix;
};
