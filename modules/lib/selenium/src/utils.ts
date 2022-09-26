import { WebDriver, WebElement, By, until } from "selenium-webdriver";
import parseDuration from "parse-duration";
import { log } from "@lib/misc/src";

import { FLUENT_WAIT_TIMEOUT, FLUENT_WAIT_POLLING } from "./const";

const parseDurationForParam = (duration: number | string): number => {
  if (typeof duration === "string") {
    try {
      duration = parseDuration(duration);
    } catch (e) {
      log.error(`invalid duration '${duration}'. Fall back to default timeout`);
      duration = 2000;
    }
  }
  return duration;
};

const parseWebDriver = (given: WebDriver | WebElement) => {
  let webDriver: WebDriver;
  if (given instanceof WebDriver) {
    webDriver = given;
  } else {
    webDriver = given.getDriver();
  }
  return webDriver;
};

export const waitAndFindElementBy = async (
  given: WebDriver | WebElement,
  locator: By,
  timeout: number | string = FLUENT_WAIT_TIMEOUT,
  polling: number | string = FLUENT_WAIT_POLLING
) => {
  const webDriver = parseWebDriver(given);
  timeout = parseDurationForParam(timeout);
  polling = parseDurationForParam(polling);

  const webelement = await webDriver.wait(
    until.elementLocated(locator),
    timeout,
    `timeout for waiting element '${locator.toString()}' for ${timeout}`,
    polling
  );
  return webelement;
};
