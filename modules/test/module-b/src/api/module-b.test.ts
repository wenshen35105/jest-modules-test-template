/**
 * @group rest
 */
import { api } from "@lib/module-b";

describe("Test module-b", () => {
  test("dummy", async () => {
    const res = await api.getCar(__FRAMEWORK_CONFIG.auth.url);
    expect(res.status).toEqual(200);
  });
});
