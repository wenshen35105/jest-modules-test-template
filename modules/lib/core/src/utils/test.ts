import type { Circus } from "@jest/types";

import { getTestPragmas, getGroupFromPragmas } from "./docblock";
import { TestRuntimeInfo } from "../types/global";
import path from "path";

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
  testName?: string,
  suffix = ""
) => {
  let outputName = path.parse(testPath).name;
  if (testName) {
    outputName = (
      outputName +
      "-" +
      testName.replace(/[^a-zA-Z0-9-]/gi, "-")
    ).substring(0, 50);
  }
  return outputName + suffix;
};
