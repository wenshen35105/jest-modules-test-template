const fs = require("fs");
const path = require("path");
const {
  resolveModuleRelativePath,
  formatTestNameAsFileName,
  MODULE_SRC_DIR,
  MODULE_OUT_DIR,
  consoleError,
} = require("../../utils");

class CoreReporter {
  onRunComplete(_testContexts, _results) {
    console.log("Triggered");
    // return Promise.resolve();
  }

  onRunStart(_results, _options) {
    return Promise.resolve();
  }

  onTestStart(test) {
    const logFileBasePath = resolveModuleRelativePath(
      test.context.config.globals.__MODULE_DIR,
      test.path,
      {
        src: MODULE_SRC_DIR,
        dest: MODULE_OUT_DIR,
      }
    );
    const logFileName = formatTestNameAsFileName(test.path, undefined, ".log");
    this.logWriteStream = fs.createWriteStream(
      path.resolve(logFileBasePath, logFileName)
    );
  }

  onTestResult(test, result, _aggregatedResults) {
    if (result.console) {
      this.logWriteStream?.write(
        result.console.reduce((prev, curr) => prev + JSON.stringify(curr), ""),
        (err) => {
          if (err) {
            consoleError(`Failed to write log for '${test.path}'`);
            consoleError(err);
          }
        }
      );
    }
    this.logWriteStream?.close();
  }

  getLastError() {
    // if (this._shouldFail) {
    //   return new Error("Custom error reported!");
    // }
  }
}

module.exports = CoreReporter;
