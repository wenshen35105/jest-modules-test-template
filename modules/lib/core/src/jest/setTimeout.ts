import { jest } from "@jest/globals";
import { TIMEOUT__UI_TEST_DEFAULT, TIMEOUT__TEST_DEFAULT } from "../const";

if (globalThis.webDriver) {
  jest.setTimeout(TIMEOUT__UI_TEST_DEFAULT);
} else {
  jest.setTimeout(TIMEOUT__TEST_DEFAULT);
}
