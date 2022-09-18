/**
 * @jest-environment <rootDir>/lib/module-a/src/environment
 */
import { describe, test, expect, beforeAll } from "@jest/globals";
import { getPlatformConfig } from "@lib/core/src/config";
import Config from "@lib/types/config";

// import { beforeAll } from "jest-circus";
import { WebDriver } from "selenium-webdriver";

let webDriver: WebDriver;

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  webDriver = globalThis.webDriver as WebDriver;
});

describe("Test module-a", () => {
  test("config", async () => {
    const platformConfig: Config.PlatformConfig = getPlatformConfig();
    expect(platformConfig.host).toEqual("google.ca");

    await webDriver.get("https://youtube.ca");

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }, 5000000);
});
