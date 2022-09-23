import { Builder, Browser, Capabilities, WebDriver } from "selenium-webdriver";
import { getSeleniumConfig } from "@lib/core/src/config/configFile";
import cp from "child_process";
import fs from "fs";
import path from "path";
import chromeVersion from "@testim/chrome-version";
import chromeDriver from "chromedriver";

const RESOLVE_CHROME_INCLUDE_CHROMIUM = false;

export const WEBDRIVERS_CHROMEDRIVER_PATH = chromeDriver.path;

export const overrideWebDriverDir = () => {
  const seleniumConfig = getSeleniumConfig();
  if (
    seleniumConfig.webDriversDir &&
    seleniumConfig.webDriversDir.length !== 0 &&
    fs.existsSync(seleniumConfig.webDriversDir)
  ) {
    process.env["PATH"] =
      seleniumConfig.webDriversDir +
      path.delimiter +
      (process.env["PATH"] || "");
    return true;
  }
  return false;
};

const getChromeVersionWitoutPatch = (chromeVersion: string) => {
  return /^(.*?)\.\d+$/.exec(chromeVersion)?.[1];
};

const isSameChromeVersion = (version1: string, version2: string) => {
  if (
    getChromeVersionWitoutPatch(version1) !==
    getChromeVersionWitoutPatch(version2)
  )
    return false;
  return true;
};

export const validateChromeDriver = async (): Promise<void> => {
  const seleniumConfig = getSeleniumConfig();
  if (seleniumConfig.browser !== "chrome") return Promise.resolve();

  try {
    const currentChromeVersion = await chromeVersion.getChromeVersion(
      RESOLVE_CHROME_INCLUDE_CHROMIUM
    );
    // if chromedriver existed
    // compare if it's matched to the current brwoser version
    // if 'yes' nothing need to be done
    if (fs.existsSync(WEBDRIVERS_CHROMEDRIVER_PATH)) {
      const chromeDriverCliVersion = cp
        .spawnSync(WEBDRIVERS_CHROMEDRIVER_PATH, ["--version"])
        .stdout.toString();
      const existingChromeDriverVersion =
        /^.* ([\d|.]+)/.exec(chromeDriverCliVersion)?.[1] || "";
      if (
        isSameChromeVersion(currentChromeVersion, existingChromeDriverVersion)
      )
        return;
    }
    // download chromedriver via script
    const resolveCp = cp.fork(require.resolve("chromedriver/install.js"), [], {
      env: {
        DETECT_CHROMEDRIVER_VERSION: "false",
        INCLUDE_CHROMIUM: RESOLVE_CHROME_INCLUDE_CHROMIUM.toString(),
        CHROMEDRIVER_VERSION: currentChromeVersion,
        CHROMEDRIVER_FORCE_DOWNLOAD: "true",
      },
    });
    await new Promise<void>((resolve, reject) => {
      resolveCp.on("close", (code) => {
        if (code !== 0)
          return reject("Download script quit non-zero exit code");
        resolve();
      });
      resolveCp.on("error", (err) => reject(err));
    });
  } catch (e) {
    console.error(
      `Failed to validate/upgrade chromdriver\nIf this blocks your test please manually replace the chromedriver from ${require.resolve(
        "chromedriver/bin"
      )}`
    );
    console.error(e);
    if (fs.existsSync(WEBDRIVERS_CHROMEDRIVER_PATH)) {
      fs.rmSync(WEBDRIVERS_CHROMEDRIVER_PATH);
    }
  }
};

export const buildWebDriver = async () => {
  const seleniumConfig = getSeleniumConfig();
  const builder = new Builder();
  // set browser capabilities
  const capabilities = new Capabilities();
  capabilities.setAcceptInsecureCerts(true);
  builder.withCapabilities(capabilities);

  if (seleniumConfig.browser === "chrome") {
    builder.forBrowser(Browser.CHROME);
  } else if (seleniumConfig.browser === "edge") {
    builder.forBrowser(Browser.EDGE);
  } else {
    builder.forBrowser(Browser.FIREFOX);
  }

  // build driver
  const driver = await builder.build();
  return driver;
};

export const setupWebDriver = async (webDriver: WebDriver) => {
  const seleniumConfig = getSeleniumConfig();
  // set default browser size
  if (seleniumConfig.window.defaultMaxmize) {
    await webDriver.manage().window().maximize();
  } else if (
    !isNaN(seleniumConfig.window.width) &&
    !isNaN(seleniumConfig.window.height)
  ) {
    await webDriver.manage().window().setRect({
      width: seleniumConfig.window.width,
      height: seleniumConfig.window.height,
      x: 0,
      y: 0,
    });
  }
};
