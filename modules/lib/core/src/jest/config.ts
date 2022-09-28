import path from "path";

import { ENV_MODULE_DIR, ENV_JEST_VSC_RUN } from "../const";
import { getJestConfig } from "../config";
import { getModuleDirs } from "../utils";

import type { Config } from "jest";

export const getConfig = (moduleDir: string): Config => {
  const jestConfig = getJestConfig();

  const rootDir = path.resolve(moduleDir, "..", "..");
  const roots = [moduleDir];

  // put module dir as env var
  process.env[ENV_MODULE_DIR] = moduleDir;

  const isVscRun = process.env[ENV_JEST_VSC_RUN] !== undefined;

  const config: Config = {
    // cache: true,
    rootDir,
    roots,
    verbose: isVscRun,
    maxConcurrency: jestConfig.maxConcurrency,
    testEnvironment: "<rootDir>/lib/core/src/jest/environment",
    moduleNameMapper: {
      "^@lib/(.*)$": "<rootDir>/lib/$1",
      "^@test/(.*)$": "<rootDir>/test/$1",
      typescript: require.resolve("typescript"),
      "ts-node": require.resolve("ts-node"),
      "ts-jest": require.resolve("ts-jest"),
      "selenium-webdriver": require.resolve("selenium-webdriver"),
    },
    runner: "<rootDir>/lib/core/src/jest/runner",
    testRunner: require.resolve("jest-circus/runner"),
    setupFilesAfterEnv: [
      "<rootDir>/lib/core/src/jest/setExpect.ts",
      "<rootDir>/lib/core/src/jest/setTimeout.ts",
    ],
    globalSetup: "<rootDir>/lib/core/src/jest/globalSetup.ts",
    reporters: ["default"],
    transform: {
      "\\.ts": [
        require.resolve("ts-jest"),
        {
          tsconfig: path.resolve(moduleDir, "tsconfig.json"),
        },
      ],
    },
  };

  if (!isVscRun) {
    config.reporters?.push([
      "<rootDir>/lib/core/src/jest/reporter",
      { outputDir: getModuleDirs().outputDir },
    ]);
  }

  return config;
};
