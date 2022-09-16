import { getPlatformConfig } from "@jest-modules-test-template/core/src/config";

// import type from another module
import type { PlatformConfig } from "@jest-modules-test-template/core/src/types/core.config";

describe("Test module-a", () => {
  test("config", () => {
    const platformConfig: PlatformConfig = getPlatformConfig();
    expect(platformConfig.host).toEqual("google.ca");
  });
});
