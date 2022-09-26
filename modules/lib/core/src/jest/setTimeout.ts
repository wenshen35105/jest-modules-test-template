import { jest } from "@jest/globals";
import parseDuration from "parse-duration";
import { TIMEOUT__TEST_DEFAULT } from "../const";
import { getJestConfig } from "../config";
import { log } from "@lib/misc";

const jestConfig = getJestConfig();
const timeoutGroup = jestConfig.timeoutGroup;

const defaultTimeout = parseDuration(TIMEOUT__TEST_DEFAULT);
let timeout = defaultTimeout;
let timeoutPlain = TIMEOUT__TEST_DEFAULT;

// https://jestjs.io/docs/configuration#setupfilesafterenv-array

globalThis.__TEST_INFO.groups.forEach((group) => {
  if (timeoutGroup[group]) {
    try {
      const groupTimeout = parseDuration(timeoutGroup[group]);
      if (groupTimeout > timeout) {
        timeout = groupTimeout;
        timeoutPlain = timeoutGroup[group];
      }
    } catch (err) {
      log.error(`Failed to parse timeout for '${group}'`);
      log.error("Please check for the configuration");
    }
  }
});

if (defaultTimeout !== timeout) {
  log.info(
    `Test timeout is set to '${timeoutPlain}' for '${globalThis.__TEST_INFO.testPath}'`
  );
}
jest.setTimeout(timeout);
