/**
 * @jest-environment <rootDir>/test/module-a/src/ui/base/uiTestBase
 */
import { describe, test, expect } from "@jest/globals";
import { getUrl } from "@lib/module-a/src/index";
import { By } from "selenium-webdriver";

describe("Test UI", () => {
  test("page", async () => {
    await webDriver.get(getUrl().toString());
    const inputElement = await webDriver.findElement(By.xpath("input"));

    expect(inputElement).not.toBeNull();
  }, 500000);
});
