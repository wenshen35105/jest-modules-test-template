import type { Config } from "jest";
import path from "path";
import fs from "fs";

export const getConfig = (moduleDir: string): Config => {

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const packageJson: any = JSON.parse(
    fs.readFileSync(path.resolve(moduleDir, "package.json"), "utf-8")
  );
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const moduleName = packageJson.name.split("/")[1] as string;

  const rootDir = path.resolve(moduleDir, "..");

  let roots: string[];
  if (process.env["TEST_FILTERS"]) {
    console.log(`TEST_FILTERS found: '${process.env["TEST_FILTERS"]}'`);
    roots = (process.env["TEST_FILTERS"])?.split(" ")?.map(filter => `${moduleName}/src/test/${filter}`);
  } else {
    roots = [moduleDir];
  }

  const config: Config = {
    rootDir,
    roots,
    preset: "ts-jest",
    verbose: true,
    testEnvironment: "node",
    moduleNameMapper: {
      "^@jest-modules-test-template/(.*)$": "<rootDir>/$1"
    },
  };

  return config;
};

