import Config from "@lib/core/src/types/config";
import { WebDriver } from "selenium-webdriver";

declare global {
  var config: Config.Config;
  var webDriver: WebDriver;
}

export {};
