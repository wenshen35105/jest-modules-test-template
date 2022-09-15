import { getPlatformRrequestClient } from "@jest-modules-test-template/core/src/index";

describe("Test module-b", () => {
  test("request", async () => {
    const res = await getPlatformRrequestClient().get("/");
    expect(res.status).toEqual(200);
  });
});
