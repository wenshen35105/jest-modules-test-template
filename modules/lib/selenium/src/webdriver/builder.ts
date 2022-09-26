import { Builder, Browser, Capabilities, WebDriver } from "selenium-webdriver";
import { Options as ChromeOptions } from "selenium-webdriver/chrome";
import { Options as FFOptions } from "selenium-webdriver/firefox";
import { Options as EdgeOptions } from "selenium-webdriver/edge";

import { log } from "@lib/misc";
import { FrameworkConfig } from "@lib/types";

export const buildWebDriver = async (
  seleniumConfig: FrameworkConfig.SeleniumConfig
): Promise<WebDriver> => {
  log.info("Start creating webDriver...");
  log.info("Browser mode: ", seleniumConfig.browser);
  log.info("Headless: ", seleniumConfig.headless);

  const builder = new Builder();
  // set browser capabilities
  const capabilities = new Capabilities();
  capabilities.setAcceptInsecureCerts(true);
  builder.withCapabilities(capabilities);

  if (seleniumConfig.browser === "chrome") {
    builder.forBrowser(Browser.CHROME);
    const options = new ChromeOptions();
    if (seleniumConfig.headless === true) {
      options.headless();
    }
    builder.setChromeOptions(options);
  } else if (seleniumConfig.browser === "edge") {
    builder.forBrowser(Browser.EDGE);
    const options = new EdgeOptions();
    if (seleniumConfig.headless === true) {
      options.headless();
    }
    builder.setEdgeOptions(options);
  } else {
    builder.forBrowser(Browser.FIREFOX);
    const options = new FFOptions();
    if (seleniumConfig.headless === true) {
      options.headless();
    }
    builder.setFirefoxOptions(options);
  }

  // build driver
  const driver = await builder.build();
  return driver;
};

export const setupWebDriver = async (
  seleniumConfig: FrameworkConfig.SeleniumConfig,
  webDriver: WebDriver
) => {
  // set default browser size
  if (seleniumConfig.window.defaultMaximize) {
    await webDriver.manage().window().maximize();
  } else if (
    !isNaN(seleniumConfig.window.width) &&
    !isNaN(seleniumConfig.window.height)
  ) {
    await webDriver.manage().window().setRect({
      width: seleniumConfig.window.width,
      height: seleniumConfig.window.height,
      x: 0,
      y: 0,
    });
  }
};
