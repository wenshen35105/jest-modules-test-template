import path from "path";
import fs from "fs";
import yaml from "yaml";

import type Config from "../types/config";

const CONFIG_FILE_LOC =
  process.env["CONFIG_FILE_LOC"] ||
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
    webDriverCycle: "test",
  };

  return { ...defaultCfg, ...config.selenium };
};

export const getConfig = (): Config.Config => ({
  platform: getPlatformConfig(),
  auth: getAuthConfig(),
  selenium: getSeleniumConfig(),
});
