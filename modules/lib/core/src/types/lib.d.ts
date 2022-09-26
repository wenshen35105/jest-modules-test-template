/* eslint-disable @typescript-eslint/no-empty-interface */
import "@lib/selenium/src/types/lib";
import { WebDriverExpectMatcher } from "@lib/selenium";

declare global {
  // https://jestjs.io/docs/expect#expectextendmatchers
  namespace jest {
    interface Expect extends WebDriverExpectMatcher {}
    interface Matchers<R> extends WebDriverExpectMatcher<R> {}
    interface InverseAsymmetricMatchers extends WebDriverExpectMatcher {}
  }
}

export {};
