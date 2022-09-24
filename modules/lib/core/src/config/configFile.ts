import path from "path";
import fs from "fs";
import yaml from "yaml";

import type Config from "../types/config";
import { ENV_CONFIG_FILE_LOC, TIMEOUT__TEST_DEFAULT } from "../const";

const CONFIG_FILE_LOC =
  process.env[ENV_CONFIG_FILE_LOC] ||
  path.resolve(__dirname, "..", "..", "config.yml");
if (!fs.existsSync(CONFIG_FILE_LOC)) {
  throw `config file '${CONFIG_FILE_LOC}' not exist`;
}

const config: Config.Config = yaml.parse(
  fs.readFileSync(CONFIG_FILE_LOC, "utf-8")
) as Config.Config;

export const getPlatformConfig = (): Config.PlatformConfig => {
  const defaultCfg: Omit<Config.AuthConfig, "url"> = {
    host: "localhost",
    port: 8080,
    schema: "https",
  };
  const cfg = {
    ...defaultCfg,
    ...config.platform,
  };
  cfg.url = new URL(`${cfg.schema}://${cfg.host}:${cfg.port}`);
  return cfg;
};

export const getAuthConfig = (): Config.AuthConfig => {
  const defaultCfg: Omit<Config.AuthConfig, "url"> = {
    host: "localhost",
    port: 8080,
    schema: "https",
  };
  const cfg = {
    ...defaultCfg,
    ...config.auth,
  };
  cfg.url = new URL(`${cfg.schema}://${cfg.host}:${cfg.port}`);
  return cfg;
};

export const getSeleniumConfig = (): Config.SeleniumConfig => {
  const defaultCfg: Config.SeleniumConfig = {
    browser: "chrome",
    webDriverCycle: "run",
    webDriversDir: undefined,
    window: {
      defaultMaxmize: false,
      width: 1920,
      height: 1080,
    },
    headless: false,
    chrome: {
      fixChromeDriverVersion: false,
    },
    edge: {
      downloadEdgeDriver: false,
      fixEdgeDriverVersion: false,
    },
  };

  return { ...defaultCfg, ...config.selenium };
};

export const getJestConfig = (): Config.JestConfig => {
  const defaultCfg: Config.JestConfig = {
    maxConcurrency: 5,
    timeoutGroup: {
      default: TIMEOUT__TEST_DEFAULT,
    },
  };
  return { ...defaultCfg, ...config.jest };
};

export const getConfig = (): Config.Config => ({
  jest: getJestConfig(),
  selenium: getSeleniumConfig(),
  platform: getPlatformConfig(),
  auth: getAuthConfig(),
});
