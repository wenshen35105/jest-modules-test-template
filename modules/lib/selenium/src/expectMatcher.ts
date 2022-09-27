import { WebDriver, By, WebElement } from "selenium-webdriver";

import { log } from "@lib/misc";
import { waitAndFindElementBy } from "./utils";
import { toMatchImageSnapshot } from "jest-image-snapshot";

export interface WebDriverExpectMatcher<R = unknown> {
  toHaveElementBy(locator: By, timeout?: number | string): Promise<R>;
  toMatchSeleniumSnapshot(): Promise<R>;
}

export const webDriverExpectMatcher = {
  async toHaveElementBy(
    received: WebDriver | WebElement,
    locator: By,
    timeout?: string | number
  ) {
    try {
      const element = await waitAndFindElementBy(received, locator, timeout);
      if (!element) throw "Empty element";
      return {
        pass: true,
        message: () => `Found element by using '${locator.toString()}'`,
      };
    } catch (e) {
      log.error(e);
      return {
        pass: false,
        message: () => `Does not found element by using ${locator.toString()}`,
      };
    }
  },
  async toMatchSeleniumSnapshot(received: WebDriver | WebElement) {
    // if (received instanceof WebElement) {
    // } else {
    const image = await received.takeScreenshot();
    return toMatchImageSnapshot.call(this, image);
    // }
  },
};
