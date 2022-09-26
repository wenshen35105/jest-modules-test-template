import path from "path";
import fs from "fs";

import { ENV_MODULE_DIR } from "../const";

import { TestModuleRuntimeInfo } from "../types/global";
import { MODULE_SRC_DIR, MODULE_OUT_DIR, MODULE_ASSET_DIR } from "../const";

/**
 * get current test module base dir
 */
export const getModuleDir = () => {
  const moduleDir = process.env[ENV_MODULE_DIR] as string;
  if (!moduleDir) throw "'MODULE_DIR' has to be defined in process.env";
  return moduleDir;
};

export const getModuleDirs = () => {
  const srcDir = path.resolve(getModuleDir(), MODULE_SRC_DIR);
  const outputDir = path.resolve(getModuleDir(), MODULE_OUT_DIR);
  const assetDir = path.resolve(getModuleDir(), MODULE_ASSET_DIR);
  return {
    srcDir,
    outputDir,
    assetDir,
  };
};

export const getTestModuleInfoForTest = (): TestModuleRuntimeInfo => {
  const moduleDir = getModuleDir();
  const moduleName = path.basename(moduleDir);
  const moduleDirs = getModuleDirs();

  const moduleInfo: TestModuleRuntimeInfo = {
    type: "test",
    name: moduleName,
    baseDir: moduleDir,
    srcDir: moduleDirs.srcDir,
    outputDir: moduleDirs.outputDir,
    assetDir: moduleDirs.assetDir,
  };

  return moduleInfo;
};

export const initTestModuleDirs = () => {
  const moduleDirs = getModuleDirs();
  [moduleDirs.outputDir].forEach((dir) => {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { force: true, recursive: true, maxRetries: 2 });
    }
    fs.mkdirSync(dir, { recursive: true });
  });
};

export const resolveModuleRelativePath = (
  testPath: string,
  replaceBasedDir: {
    src: string;
    dest: string;
  },
  ...subDir: string[]
): string => {
  const moduleDir = getModuleDir();

  if (!testPath.startsWith(moduleDir)) {
    throw new Error("Invalid testPath");
  }
  let outFolderPath = path
    .dirname(testPath)
    .substring(moduleDir.length)
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
