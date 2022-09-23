import path from "path";
import fs from "fs";

import { getTestPragmas, getGroupFromPragmas } from "./docblock";
import { ModuleRuntimeInfo, TestRuntimeInfo } from "../types/global";

const getModuleDirs = (moduleDir: string) => {
  const outputDir = path.resolve(moduleDir, "output");
  return {
    logDir: path.resolve(outputDir, "log"),
    failedScreenShotDir: path.resolve(outputDir, "failedScreenshot"),
  };
};

export const getTestModuleInfoForTest = (
  moduleDir: string
): ModuleRuntimeInfo => {
  const moduleName = path.basename(moduleDir);
  const moduleDirs = getModuleDirs(moduleDir);

  const moduleInfo: ModuleRuntimeInfo = {
    type: "test",
    name: moduleName,
    logDir: moduleDirs.logDir,
    failedScreenShotDir: moduleDirs.failedScreenShotDir,
  };

  return moduleInfo;
};

export const getTestInfoForTest = (testPath: string): TestRuntimeInfo => {
  return {
    groups: getGroupFromPragmas(getTestPragmas(testPath)),
    testPath: testPath,
  };
};

export const initTestModuleDirs = (moduleDir: string) => {
  const moduleDirs = getModuleDirs(moduleDir);
  [moduleDirs.logDir, moduleDirs.failedScreenShotDir].forEach((dir) => {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { force: true, recursive: true, maxRetries: 2 });
    }
    fs.mkdirSync(dir, { recursive: true });
  });
};
