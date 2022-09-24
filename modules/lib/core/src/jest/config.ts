import type { Config } from "jest";
import path from "path";

import { getJestConfig } from "../config";

export const getConfig = (moduleDir: string): Config => {
  const jestConfig = getJestConfig();

  const rootDir = path.resolve(moduleDir, "..", "..");
  const roots = [moduleDir];

  const config: Config = {
    rootDir,
    roots,
    verbose: true,
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
    setupFilesAfterEnv: ["<rootDir>/lib/core/src/jest/setTimeout.ts"],
    globals: {
      __MODULE_DIR: moduleDir,
    },
    globalSetup: "<rootDir>/lib/core/src/jest/globalSetup.ts",
    // reporters: ["default", "<rootDir>/lib/core/src/jest/reporter.js"],
    reporters: ["<rootDir>/lib/core/src/jest/reporter"],
    transform: {
      "\\.ts": [
        "ts-jest",
        {
          tsconfig: path.resolve(moduleDir, "tsconfig.json"),
        },
      ],
    },
  };

  return config;
};
