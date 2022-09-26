import { PageObjBase } from "@lib/types";
import { By, WebElement, WebDriver } from "selenium-webdriver";

export class MyPageObj implements PageObjBase {
  locators!: {
    [extras: string]: By;
    [extras: number]: By;
    [extras: symbol]: By;
  };
  webElements!: {
    [extras: string]: WebElement;
    [extras: number]: WebElement;
    [extras: symbol]: WebElement;
  };
  webDriver!: WebDriver;

  find(webDriver: WebDriver): Promise<PageObjBase> {
    throw new Error("Method not implemented.");
  }
}
