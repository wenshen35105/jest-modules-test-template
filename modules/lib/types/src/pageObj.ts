import { By, WebDriver, WebElement } from "selenium-webdriver";

type PageObjElements = {
  [extras: PropertyKey]: WebElement;
};

export interface PageObjBase {
  locators: {
    [extras: PropertyKey]: By;
  };

  webElements: PageObjElements;

  webDriver: WebDriver;

  // constructor(webDriver: WebDriver, webElements: PageObjElements) {
  //   this.webDriver = webDriver;
  //   this.webElements = webElements;
  // }

  find(webDriver: WebDriver): Promise<PageObjBase>;
}
