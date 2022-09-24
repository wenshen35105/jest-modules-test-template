import { Builder, Browser, Capabilities, WebDriver } from "selenium-webdriver";
import { Options as ChromeOptions } from "selenium-webdriver/chrome";
import { Options as FFOptions } from "selenium-webdriver/firefox";
import { Options as EdgeOptions } from "selenium-webdriver/edge";
import { getSeleniumConfig } from "@lib/core/src/config/configFile";
import cp from "child_process";
import fs from "fs";
import path from "path";
import chromeVersion from "@testim/chrome-version";
import chromeDriver from "chromedriver";
import { installDriver as installEdgeDriver } from "ms-chromium-edge-driver";

import { consoleInfo, consoleError } from "../utils";

const RESOLVE_CHROME_INCLUDE_CHROMIUM = false;

export const WEBDRIVERS_CHROMEDRIVER_PATH = chromeDriver.path;

export const WEBDRIVERS_EDGEDRIVER_BASE_PATH = path.resolve(
  require.resolve("ms-chromium-edge-driver"),
  "..",
  "..",
  "bin"
);
export const WEBDRIVERS_EDGEDRIVER_PATH = path.resolve(
  WEBDRIVERS_EDGEDRIVER_BASE_PATH,
  process.platform === "win32" ? "msedgedriver.exe" : "msedgedriver"
);

export const addToPath = (addingPath: string) => {
  process.env["PATH"] =
    addingPath + path.delimiter + (process.env["PATH"] || "");
};

export const overrideWebDriverDirFromConfig = () => {
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
  if (
    seleniumConfig.browser !== "chrome" ||
    seleniumConfig.chrome.fixChromeDriverVersion !== true
  )
    return Promise.resolve();

  try {
    consoleInfo("Start validating chromeDriver version");
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
      ) {
        consoleInfo(
          "The Chrome version matches to the chromDriver version. Skipping upgrade"
        );
        return;
      }
    }
    consoleInfo(`Installing chromDriver version ${currentChromeVersion}...`);
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
        if (code !== 0) {
          return reject("Download script quit non-zero exit code");
        }
        consoleInfo(`chromDriver ${currentChromeVersion} has been installed`);
        resolve();
      });
      resolveCp.on("error", (err) => reject(err));
    });
  } catch (e) {
    consoleError("Failed to validate/upgrade chromdriver");
    consoleError(e);
    if (fs.existsSync(WEBDRIVERS_CHROMEDRIVER_PATH)) {
      fs.rmSync(WEBDRIVERS_CHROMEDRIVER_PATH);
    }
  }
};

export const validateEdgeDriver = async (): Promise<void> => {
  const seleniumConfig = getSeleniumConfig();
  if (seleniumConfig.browser === "edge") {
    if (
      fs.existsSync(WEBDRIVERS_EDGEDRIVER_PATH) &&
      seleniumConfig.edge.fixEdgeDriverVersion === true
    ) {
      process.env["EDGEDRIVER_FORCE_DOWNLOAD"] = "true";
      consoleInfo(
        `edgeDriver found, and fixEdgeDriverVersion is 'true'; re-downloading edgeDriver...`
      );
      await installEdgeDriver();
    }

    if (
      !fs.existsSync(WEBDRIVERS_EDGEDRIVER_PATH) &&
      seleniumConfig.edge.downloadEdgeDriver === true
    ) {
      consoleInfo(
        `edgeDriver not found, and downloadEdgeDriver is 'true'; downloading edgeDriver...`
      );
      await installEdgeDriver();
    }
    // add where the driver will be to the path dir
    addToPath(WEBDRIVERS_EDGEDRIVER_BASE_PATH);
  }
};

export const buildWebDriver = async () => {
  const seleniumConfig = getSeleniumConfig();
  consoleInfo("Start creating webDriver...");
  consoleInfo("Browser mode: ", seleniumConfig.browser);
  consoleInfo("Headless: ", seleniumConfig.headless);

  const builder = new Builder();
  // set browser capabilities
  const capabilities = new Capabilities();
  capabilities.setAcceptInsecureCerts(true);
  builder.withCapabilities(capabilities);

  if (seleniumConfig.browser === "chrome") {
    builder.forBrowser(Browser.CHROME);
    const options = new ChromeOptions();
    if (seleniumConfig.headless === true) {
      options.headless();
    }
    builder.setChromeOptions(options);
  } else if (seleniumConfig.browser === "edge") {
    builder.forBrowser(Browser.EDGE);
    const options = new EdgeOptions();
    if (seleniumConfig.headless === true) {
      options.headless();
    }
    builder.setEdgeOptions(options);
  } else {
    builder.forBrowser(Browser.FIREFOX);
    const options = new FFOptions();
    if (seleniumConfig.headless === true) {
      options.headless();
    }
    builder.setFirefoxOptions(options);
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
