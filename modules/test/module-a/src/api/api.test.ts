import { describe, test, expect } from "@jest/globals";
import { getRequestClient } from "@lib/module-a/src/index";

describe("Test API", () => {
  test("get", async () => {
    const requestClient = getRequestClient();
    const res = await requestClient.get("/");
    expect(res.status).toEqual(200);
  });
});
