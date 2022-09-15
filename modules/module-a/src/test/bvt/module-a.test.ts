import { config } from "@jest-modules-test-template/core/src/index";

describe("Test module-a", () => {
  test("config", () => {
    const pltformConfig = config.getPlatformConfig();
    expect(pltformConfig.host).toEqual("google.ca");
  });
});
