import type { FrameworkConfig } from "@lib/types";

export type Pragmas = Record<string, string | Array<string>>;

export interface PragmaSeleniumConfig {
  webDriverCycle: FrameworkConfig.WebDriverCycle;
}
