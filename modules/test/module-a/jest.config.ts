import { getConfig } from "@lib/jest/src";
import type { Config } from "jest";
const config: Config = getConfig(__dirname);
export default config;