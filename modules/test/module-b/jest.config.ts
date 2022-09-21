import { getConfig } from "@lib/core/src/jest";
import type { Config } from "jest";

export default (): Config => getConfig(__dirname);
