import path from "path";
import fs from "fs";
import yaml from "yaml";

import type Config from "./types/config";

const CONFIG_FILE_LOC =
  process.env["CONFIG_FILE_LOC"] || path.resolve(__dirname, "..", "config.yml");
if (!fs.existsSync(CONFIG_FILE_LOC)) {
  throw `config file '${CONFIG_FILE_LOC}' not exist`;
}

const config: Config.Config = yaml.parse(
  fs.readFileSync(CONFIG_FILE_LOC, "utf-8")
) as Config.Config;

export const getPlatformConfig = (): Config.PlatformConfig => {
  const output = config.platform;
  output.url = new URL(`${output.schema}://${output.host}:${output.port}`);
  return output;
};

export const getAuthConfig = (): Config.AuthConfig => {
  const output = config.auth;
  output.url = new URL(`${output.schema}://${output.host}:${output.port}`);
  return output;
};

export const getSeleniumConfig = (): Config.SeleniumConfig => {
  return config.selenium;
};

export const getConfig = (): Config.Config => ({
  platform: getPlatformConfig(),
  auth: getAuthConfig(),
  selenium: getSeleniumConfig(),
});
