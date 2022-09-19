import { getConfig } from "@lib/core/src/jest";
import type { Config } from "jest";
const config: Config = getConfig(__dirname);
export default config;
