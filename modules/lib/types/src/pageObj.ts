import { By, WebDriver, WebElement } from "selenium-webdriver";

// type PageObjConstructorElements = {
//   [extras: PropertyKey]: WebElement;
// };

export interface PageObjBase {
  locators: {
    [extras: PropertyKey]: By;
  };

  varwebElements: {
    [extras: PropertyKey]: WebElement;
  };

  // constructor: (webDriver: WebDriver, webElements: PageObjConstructorElements) => PageObjBase;

  find: (webDriver: WebDriver) => Promise<PageObjBase>;
}
