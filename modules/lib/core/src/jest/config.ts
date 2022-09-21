import type { Config } from "jest";
import path from "path";

export const getConfig = (moduleDir: string): Config => {
  const rootDir = path.resolve(moduleDir, "..", "..");
  const roots = [moduleDir];

  const config: Config = {
    rootDir,
    roots,
    verbose: true,
    testEnvironment: "<rootDir>/lib/core/src/jest/environment",
    moduleNameMapper: {
      "^@lib/(.*)$": "<rootDir>/lib/$1",
      "^@test/(.*)$": "<rootDir>/test/$1",
      typescript: require.resolve("typescript"),
      "ts-node": require.resolve("ts-node"),
      "ts-jest": require.resolve("ts-jest"),
    },
    runner: "<rootDir>/lib/core/src/jest/runner",
    testRunner: require.resolve("jest-circus/runner"),
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
