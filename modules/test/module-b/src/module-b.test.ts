import { describe, test, expect } from "@jest/globals";

import { getPlatformRrequestClient } from "@lib/core/src/request";

describe("Test module-b", () => {
  test("request", async () => {
    const res = await getPlatformRrequestClient().get("/");
    expect(res.status).toEqual(200);
  });
});
