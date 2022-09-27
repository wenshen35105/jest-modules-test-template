import { WebDriver, WebElement, By } from "selenium-webdriver";
import parseDuration from "parse-duration";
import { log } from "@lib/misc/src";

import { EXPLICT_WAIT_TIMEOUT } from "./const";

const parseDurationForParam = (duration: number | string): number => {
  if (typeof duration === "string") {
    try {
      duration = parseDuration(duration);
    } catch (e) {
      log.error(`invalid duration '${duration}'. Fall back to default timeout`);
      duration = EXPLICT_WAIT_TIMEOUT;
    }
  }
  return duration;
};

const isWebDriver = (given: WebDriver | WebElement): boolean => {
  if ((given as WebElement).getDriver) {
    return false;
  } else {
    return true;
  }
};

const parseWebDriver = (given: WebDriver | WebElement) => {
  let webDriver: WebDriver;
  if (isWebDriver(given)) {
    webDriver = given as WebDriver;
  } else {
    webDriver = (given as WebElement).getDriver();
  }
  return webDriver;
};

export const waitAndFindElementBy = async (
  given: WebDriver | WebElement,
  locator: By,
  timeout: number | string = EXPLICT_WAIT_TIMEOUT
) => {
  const webDriver = parseWebDriver(given);
  timeout = parseDurationForParam(timeout);

  const webelement = await webDriver.wait(() => {
    return webDriver.findElement(locator);
  }, timeout);
  return webelement;
};
