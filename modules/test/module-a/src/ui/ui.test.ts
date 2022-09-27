/**
 * @group selenium
 * @selenium { "webDriverCycle": "test" }
 */

import { By } from "selenium-webdriver";

describe("UI sample - 2", () => {
  beforeEach(async () => {
    await webDriver.get("https://youtube.ca");
  });

  test("page", async () => {
    await webDriver.get(__FRAMEWORK_CONFIG.platform.url.toString());
    expect(1).toEqual(1);
  });
  test("page1", async () => {
    await webDriver.get("https://ibm.com");
    const inputElement = await webDriver.findElement(By.xpath("input"));

    expect(inputElement).not.toBeNull();
  });
});
