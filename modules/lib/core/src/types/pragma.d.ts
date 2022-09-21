import type Config from "./config";

export type Pragmas = Record<string, string | Array<string>>;

export interface PragmaSeleniumConfig {
  webDriverCycle: Config.WebDriverCycle;
}
