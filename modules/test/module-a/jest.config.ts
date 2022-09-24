import { getConfig } from "@lib/core/src/jest";
import type { Config } from "@lib/core/src/types/jest";

export default (): Config => getConfig(__dirname);
