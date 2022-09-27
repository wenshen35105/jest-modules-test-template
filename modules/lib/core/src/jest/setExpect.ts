import { expect } from "@jest/globals";
import { webDriverExpectMatcher } from "@lib/selenium";
import { resolveModuleRelativePath } from "../utils";
import {
  MODULE_SRC_DIR,
  MODULE_OUT_DIR,
  TEST_IMAGE_SNAPSHOT_DIFF_DIR,
} from "../const";

expect.extend(
  webDriverExpectMatcher({
    resolveDiffDir: (testPath) => {
      return testPath
        ? resolveModuleRelativePath(
            testPath,
            { src: MODULE_SRC_DIR, dest: MODULE_OUT_DIR },
            TEST_IMAGE_SNAPSHOT_DIFF_DIR
          )
        : undefined;
    },
  })
);
