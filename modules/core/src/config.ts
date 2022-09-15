
import path from "path";
import fs from "fs";
import yaml from "yaml";

import type { PlatformConfig, AllConfig } from "./types/core.config";

const CONFIG_FILE_LOC = process.env["CONFIG_FILE_LOC"] || path.resolve(__dirname, "..", "config.yml");
if (!fs.existsSync(CONFIG_FILE_LOC)) {
  throw `config file '${CONFIG_FILE_LOC}' not exist`;
}

const config: AllConfig = yaml.parse(fs.readFileSync(CONFIG_FILE_LOC, "utf-8")) as AllConfig;

const getPlatformConfig = (): PlatformConfig => {
  return config.platform;
};

export { getPlatformConfig };
