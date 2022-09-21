import type Config from "./config";
import type { WebDriver } from "@types/selenium-webdriver";

declare global {
  var config: Config.Config;
  // only available when using an selenium enviornment
  var webDriver: WebDriver;
}

export {};
