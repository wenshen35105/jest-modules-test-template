import cp from "child_process";
import fs from "fs";

import chromeVersion from "@testim/chrome-version";
import chromeDriver from "chromedriver";

import { log } from "@lib/misc";
import { FrameworkConfig } from "@lib/types";

const RESOLVE_CHROME_INCLUDE_CHROMIUM = false;
const WEBDRIVERS_CHROMEDRIVER_PATH = chromeDriver.path;

const getChromeVersionWitoutPatch = (chromeVersion: string) => {
  return /^(.*?)\.\d+$/.exec(chromeVersion)?.[1];
};

export const isSameChromeVersion = (version1: string, version2: string) => {
  if (
    getChromeVersionWitoutPatch(version1) !==
    getChromeVersionWitoutPatch(version2)
  )
    return false;
  return true;
};

export const validateChromeDriver = async (
  seleniumConfig: FrameworkConfig.SeleniumConfig
): Promise<void> => {
  if (
    seleniumConfig.browser !== "chrome" ||
    seleniumConfig.chrome.fixChromeDriverVersion !== true
  )
    return Promise.resolve();

  try {
    log.info("Start validating chromeDriver version");
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
        log.info(
          "The Chrome version matches to the chromDriver version. Skipping upgrade"
        );
        return;
      }
    }
    log.info(`Installing chromDriver version ${currentChromeVersion}...`);
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
        log.info(`chromDriver ${currentChromeVersion} has been installed`);
        resolve();
      });
      resolveCp.on("error", (err) => reject(err));
    });
  } catch (e) {
    log.error("Failed to validate/upgrade chromdriver");
    log.error(e);
    if (fs.existsSync(WEBDRIVERS_CHROMEDRIVER_PATH)) {
      fs.rmSync(WEBDRIVERS_CHROMEDRIVER_PATH);
    }
  }
};
