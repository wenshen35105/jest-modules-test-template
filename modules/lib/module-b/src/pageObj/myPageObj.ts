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

  async find(webDriver: WebDriver): Promise<PageObjBase> {
    await webDriver.findElement(By.xpath(""));
    throw new Error("Method not implemented.");
  }
}
