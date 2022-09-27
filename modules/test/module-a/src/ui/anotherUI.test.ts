/**
 * @group selenium
 */

import { By } from "selenium-webdriver";

describe("UI sample - 1", () => {
  test("page2", async () => {
    await webDriver.get("https://apple.ca");

    const locator = By.xpath("(//a[@class='unit-link'])[1]");
    await expect(webDriver).toHaveElementBy(locator);
    const element = webDriver.findElement(locator);

    await expect(element).toMatchSeleniumSnapshot();
  }, 500000); // add specific timeout for a test
});
