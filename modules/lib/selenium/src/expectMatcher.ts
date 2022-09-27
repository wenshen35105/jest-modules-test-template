import { WebDriver, By, WebElement } from "selenium-webdriver";

import { log } from "@lib/misc";
import { waitAndFindElementBy } from "./utils";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import sharp from "sharp";

import type { MatcherContext } from "@jest/expect";

export interface WebDriverExpectMatcher<R = unknown> {
  toHaveElementBy(locator: By, timeout?: number | string): Promise<R>;
  toMatchSeleniumSnapshot(): Promise<R>;
}

export const webDriverExpectMatcher = ({
  resolveDiffDir,
}: {
  resolveDiffDir: (testPath?: string) => string | undefined;
}) => ({
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
  async toMatchSeleniumSnapshot(
    this: MatcherContext,
    received: WebDriver | WebElement
  ) {
    const image: string = await sharp(
      Buffer.from(await received.takeScreenshot(), "base64")
    )
      .resize(256)
      .toBuffer()
      .then((buffer) => buffer.toString("base64"))
      .then((image) => image.replace(/^data:image\/\w+;base64,/, ""));

    return toMatchImageSnapshot.call(this, image, {
      customDiffDir: resolveDiffDir(this.testPath),
    });
  },
});
