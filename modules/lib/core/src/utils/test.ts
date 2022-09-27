import path from "path";
import fs from "fs";
import os from "os";
import { kebabCase, toString } from "lodash";

import { getTestPragmas, getGroupFromPragmas } from "./docblock";
import { TEST_ANSI_REMOVE_REGEX } from "../const";
import { resolveOutPathFromTestPath } from "./testModule";
import { log } from "@lib/misc";

import type { Circus } from "@jest/types";
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

export const saveTestFailureToLog = async (
  testPath: string,
  test: Circus.TestEntry
) => {
  const logPath = path.resolve(
    resolveOutPathFromTestPath(testPath),
    formatTestNameAsFileName(testPath, test.name, ".log")
  );

  // in the case of retry successed
  if (test.errors.length === 0) {
    if (fs.existsSync(logPath)) fs.rmSync(logPath);
    return;
  }

  for (const error of test.errors) {
    const errorTxt = toString(error).replace(TEST_ANSI_REMOVE_REGEX, "");
    const logStream = fs.createWriteStream(logPath, "utf-8");
    try {
      for (const txt of errorTxt.split(os.EOL)) {
        await new Promise<void>((resolve, reject) => {
          logStream.write(txt, (err) => {
            if (err) reject(err);
            resolve();
          });
        });
      }
    } catch (e) {
      log.error("Failed to save log as file", e);
    } finally {
      logStream.close();
    }
  }
};
