/**
 * @group selenium
 */

import { By } from "selenium-webdriver";

describe("UI sample - 1", () => {
  test("page2", async () => {
    // await new Promise((resolve) => setTimeout(resolve, 10000));
    await webDriver.get("https://apple.ca");
    // await webDriver.get(config.platform.url.toString());
    // const inputElement = await webDriver.findElement(By.xpath("input"));

    await expect(webDriver).toHaveElementBy(
      By.xpath("//span[contains(text(), 'Mac')]")
    );
    await expect(webDriver).toMatchSeleniumSnapshot();
  }, 500000); // add specific timeout for a test
});
