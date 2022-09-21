import { getCar } from "@lib/module-b/src/api";

describe("Test module-b", () => {
  test("dummy", async () => {
    const res = await getCar(config.auth.url);
    expect(res.status).toEqual(200);
  });
});
