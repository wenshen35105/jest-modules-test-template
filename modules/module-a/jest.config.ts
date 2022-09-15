import type { Config } from 'jest';
import path from 'path';
import fs from 'fs';

const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, "package.json"), "utf-8"));

const IS_DEV = fs.existsSync(path.resolve(__dirname, "dist"));
const rootDir = IS_DEV ? path.resolve(__dirname, "dist") : path.resolve(__dirname, "..", "..", "dist");

const TEST_SCOPES = (process.env['TEST_SCOPES'])?.split(" ")?.map(scope => `${packageJson.name.split("/")[1]}/src/test/${scope}`);

const config: Config = {
  verbose: true,
  rootDir,
  moduleNameMapper: {
    "^@jest-modules-test-template/(.*)$": "<rootDir>/$1"
  }
};

if (TEST_SCOPES) {
  console.log(`TEST_SCOPES: ${TEST_SCOPES.toString()}`);
  config.roots = TEST_SCOPES;
} else {
  console.log(`TEST_SCOPES isn't specified`)
}

export default config;