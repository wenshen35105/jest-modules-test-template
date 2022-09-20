/**
 * @jest-environment <rootDir>/test/module-a/src/ui/base/uiTestBase
 */
import { describe, test, expect } from "@jest/globals";
import { By } from "selenium-webdriver";

describe("Test UI", () => {
  test("page", async () => {
    await webDriver.get(config.platform.url.toString());
    const inputElement = await webDriver.findElement(By.xpath("input"));

    expect(inputElement).not.toBeNull();
  }, 500000);
});
