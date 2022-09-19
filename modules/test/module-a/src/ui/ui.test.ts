/**
 * @jest-environment <rootDir>/test/module-a/src/environments/module-a-scenario
 */
import { describe, test, expect, beforeAll } from "@jest/globals";
import { getUrl } from "@lib/module-a/src/index";
import { WebDriver, By } from "selenium-webdriver";

let webDriver: WebDriver;

beforeAll(() => {
  webDriver = globalThis.webDriver as WebDriver;
});

describe("Test UI", () => {
  test("page", async () => {
    await webDriver.get(getUrl().toString());
    const inputElement = await webDriver.findElement(By.xpath("input"));

    expect(inputElement).not.toBeNull();
  }, 500000);
});
