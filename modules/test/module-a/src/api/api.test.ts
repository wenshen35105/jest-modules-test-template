import { api } from "@lib/module-a";

describe("Test API", () => {
  test("get", async () => {
    const res = await api.getAnimal(__FRAMEWORK_CONFIG.platform.url);
    expect(res.status).toEqual(404);
  });
});
