import { expect } from "@jest/globals";
import { webDriverExpectMatcher } from "@lib/selenium";

expect.extend(webDriverExpectMatcher);
