import Config from "@lib/core/src/types/config";
import { WebDriver } from "selenium-webdriver";

declare global {
  var config: Config.Config;
  // only available when using an selenium enviornment
  var webDriver: WebDriver;
}

export {};
