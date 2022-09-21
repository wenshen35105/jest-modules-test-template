/**
 * @group selenium
 * @selenium { "webDriverCycle": "run" }
 */

import { By } from "selenium-webdriver";

beforeEach(async () => {
  await webDriver.get("https://youtube.ca");
}, 500000);

describe("UI sample", () => {
  test("page", async () => {
    await webDriver.get(config.platform.url.toString());
    const inputElement = await webDriver.findElement(By.xpath("input"));

    expect(inputElement).not.toBeNull();
  }, 500000);
  test("page1", async () => {
    await webDriver.get("https://ibm.com");
    const inputElement = await webDriver.findElement(By.xpath("input"));

    expect(inputElement).not.toBeNull();
  }, 500000);
});
