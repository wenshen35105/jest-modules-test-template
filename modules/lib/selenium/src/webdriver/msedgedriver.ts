import fs from "fs";
import path from "path";

import { installDriver as installEdgeDriver } from "ms-chromium-edge-driver";

import { FrameworkConfig } from "@lib/types";
import { log } from "@lib/misc";

const WEBDRIVERS_EDGEDRIVER_BASE_PATH = path.resolve(
  require.resolve("ms-chromium-edge-driver"),
  "..",
  "..",
  "bin"
);
const WEBDRIVERS_EDGEDRIVER_PATH = path.resolve(
  WEBDRIVERS_EDGEDRIVER_BASE_PATH,
  process.platform === "win32" ? "msedgedriver.exe" : "msedgedriver"
);

const addToPath = (addingPath: string) => {
  process.env["PATH"] =
    addingPath + path.delimiter + (process.env["PATH"] || "");
};

export const validateEdgeDriver = async (
  seleniumConfig: FrameworkConfig.SeleniumConfig
): Promise<void> => {
  if (seleniumConfig.browser === "edge") {
    if (
      fs.existsSync(WEBDRIVERS_EDGEDRIVER_PATH) &&
      seleniumConfig.edge.fixEdgeDriverVersion === true
    ) {
      process.env["EDGEDRIVER_FORCE_DOWNLOAD"] = "true";
      log.info(
        `edgeDriver found, and fixEdgeDriverVersion is 'true'; re-downloading edgeDriver...`
      );
      await installEdgeDriver();
    }

    if (
      !fs.existsSync(WEBDRIVERS_EDGEDRIVER_PATH) &&
      seleniumConfig.edge.downloadEdgeDriver === true
    ) {
      log.info(
        `edgeDriver not found, and downloadEdgeDriver is 'true'; downloading edgeDriver...`
      );
      await installEdgeDriver();
    }
    // add where the driver will be to the path dir
    addToPath(WEBDRIVERS_EDGEDRIVER_BASE_PATH);
  }
};
