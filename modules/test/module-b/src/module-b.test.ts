import { describe, test, expect } from "@jest/globals";

import { getUrl } from "@lib/module-b/src/index";

describe("Test module-b", () => {
  test("dummy", () => {
    const url = getUrl();
    expect(url.toString()).toContain("https");
  });
});
