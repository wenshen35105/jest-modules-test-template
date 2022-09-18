import { Builder, Browser } from "selenium-webdriver";
import { getSeleniumConfig } from "./config";

export const buildWebDriver = async () => {
  const seleniumConfig = getSeleniumConfig();
  let browserType: string;

  if (seleniumConfig.browser === "chrome") {
    browserType = Browser.CHROME;
  } else if (seleniumConfig.browser === "edge") {
    browserType = Browser.EDGE;
  } else {
    browserType = Browser.FIREFOX;
  }

  const driver = await new Builder().forBrowser(browserType).build();
  return driver;
};