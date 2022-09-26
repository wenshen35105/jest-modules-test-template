import { WebDriver, WebElement, By } from "selenium-webdriver";

export const findElementBy = async (
  given: WebDriver | WebElement,
  locator: By,
  timeout = 2000
) => {
  let webDriver: WebDriver;
  if (given instanceof WebDriver) {
    webDriver = given;
  } else {
    webDriver = given.getDriver();
  }
  const webelement = await webDriver.wait(given.findElement(locator), timeout);
  return webelement;
};
