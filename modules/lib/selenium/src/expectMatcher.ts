import { WebDriver, By, WebElement } from "selenium-webdriver";

import { log } from "@lib/misc";

export interface WebDriverExpectMatcher<R = unknown> {
  toHaveElementBy(by: By, timeout?: number): Promise<R>;
}

export const webDriverExpectMatcher = {
  toHaveElementBy: async (
    received: WebDriver | WebElement,
    by: By
    // timeout = 2000
  ) => {
    let webDriver: WebDriver;
    if (received instanceof WebElement) {
      webDriver = received.getDriver();
    } else {
      webDriver = received;
    }
    try {
      await webDriver.findElement(by);
      return {
        pass: true,
        message: () => `Found element by using ${by.toString()}`,
      };
    } catch (e) {
      log.error(e);
      return {
        pass: false,
        message: () => `Does not found element by using ${by.toString()}`,
      };
    }
  },
};
