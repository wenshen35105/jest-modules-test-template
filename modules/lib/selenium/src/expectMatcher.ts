import { WebDriver, By, WebElement } from "selenium-webdriver";

import { log } from "@lib/misc";
import { waitAndFindElementBy } from "./utils";

export interface WebDriverExpectMatcher<R = unknown> {
  toHaveElementBy(
    locator: By,
    timeout?: number | string,
    polling?: string | number
  ): Promise<R>;
}

export const webDriverExpectMatcher = {
  toHaveElementBy: async (
    received: WebDriver | WebElement,
    locator: By,
    timeout?: string | number,
    polling?: string | number
  ) => {
    try {
      const element = await waitAndFindElementBy(
        received,
        locator,
        timeout,
        polling
      );
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
};
