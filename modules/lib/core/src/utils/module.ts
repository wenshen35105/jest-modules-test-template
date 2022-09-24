import path from "path";
import fs from "fs";

import { ModuleRuntimeInfo } from "../types/global";

export const MODULE_SRC_DIR = "src";
export const MODULE_OUT_DIR = "output";

const getModuleDirs = (moduleDir: string) => {
  const srcDir = path.resolve(moduleDir, MODULE_SRC_DIR);
  const outputDir = path.resolve(moduleDir, MODULE_OUT_DIR);
  return {
    srcDir,
    outputDir,
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
    srcDir: moduleDirs.srcDir,
    outputDir: moduleDirs.outputDir,
  };

  return moduleInfo;
};

export const initTestModuleDirs = (moduleDir: string) => {
  const moduleDirs = getModuleDirs(moduleDir);
  [moduleDirs.outputDir].forEach((dir) => {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { force: true, recursive: true, maxRetries: 2 });
    }
    fs.mkdirSync(dir, { recursive: true });
  });
};

export const resolveModuleRelativePath = (
  moduleDir: string,
  testPath: string,
  replaceBasedDir: {
    src: string;
    dest: string;
  },
  ...subDir: string[]
): string => {
  if (!testPath.startsWith(moduleDir)) {
    throw new Error("Invalid testPath");
  }
  let outFolderPath = path.dirname(testPath);
  outFolderPath = outFolderPath
    .split(moduleDir)[1]
    .replace(replaceBasedDir.src, replaceBasedDir.dest);
  outFolderPath = outFolderPath.startsWith(path.sep)
    ? outFolderPath.slice(1)
    : outFolderPath;
  outFolderPath = path.resolve(moduleDir, outFolderPath, ...subDir);

  if (!fs.existsSync(outFolderPath)) {
    fs.mkdirSync(outFolderPath, { recursive: true });
  }

  return outFolderPath;
};
