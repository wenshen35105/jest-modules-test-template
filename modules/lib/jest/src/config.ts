import type { Config } from "jest";
import path from "path";

export const getConfig = (moduleDir: string): Config => {
  const rootDir = path.resolve(moduleDir, "..", "..");
  const roots = [moduleDir];

  const config: Config = {
    rootDir,
    roots,
    verbose: true,
    testEnvironment: "node",
    moduleNameMapper: {
      "^@lib/(.*)$": "<rootDir>/lib/$1",
      "^@test/(.*)$": "<rootDir>/test/$1",
    },
    testRunner: "jest-circus",
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