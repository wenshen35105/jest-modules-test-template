import { describe, test, expect } from "@jest/globals";
import { getAnimal } from "@lib/module-a/src/api";

describe("Test API", () => {
  test("get", async () => {
    const res = await getAnimal(config.platform.url);
    expect(res.status).toEqual(404);
  });
});
