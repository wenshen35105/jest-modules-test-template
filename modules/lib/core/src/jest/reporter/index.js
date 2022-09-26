const { BaseReporter } = require("@jest/reporters");
const { parse } = require("jest-docblock");
const path = require("path");
const fs = require("fs");

const genReportHTMLString = require("./template");

// copy from @lib/core/src/const.ts
const PRAGMA__GROUP = "group";

// copy from @lib/core/src/utils/docblock.ts
const getGroupFromPragmas = (testPath) => {
  const pragmas = parse(fs.readFileSync(testPath, "utf8"));
  if (pragmas[PRAGMA__GROUP]) {
    const group = pragmas[PRAGMA__GROUP];
    if (Array.isArray(group)) return group;
    return [group];
  }
  return [];
};

class CoreReporter extends BaseReporter {
  constructor(globalConfig, context) {
    super();
    this.globalConfig = globalConfig;
    this.context = context;

    this.catalogStat = [];
    this.testData = [];

    if (
      !this.context["outputDir"] ||
      !fs.existsSync(this.context["outputDir"])
    ) {
      throw new Error("require report option: 'outputDir' doesnt exist");
    }
  }

  onRunComplete(_testContexts, aggregatedResult) {
    this.catalogStat.push({
      type: "all",
      test: {
        total: aggregatedResult.numTotalTests,
        failed: aggregatedResult.numFailedTests,
        passed: aggregatedResult.numPassedTests,
        pending: aggregatedResult.numPendingTests,
      },
    });

    this.catalogStat.push({
      type: "suite",
      test: {
        total: aggregatedResult.numTotalTestSuites,
        failed: aggregatedResult.numFailedTestSuites,
        passed: aggregatedResult.numPassedTestSuites,
        pending: aggregatedResult.numPendingTests,
      },
    });

    const catalogGroupStat = {};

    aggregatedResult.testResults.forEach((suiteResult) => {
      const belongingGroups = getGroupFromPragmas(suiteResult.testFilePath);

      belongingGroups.forEach((belongingGroup) => {
        catalogGroupStat[belongingGroup] = {
          failed:
            (catalogGroupStat[belongingGroup]?.failed || 0) +
            suiteResult.numFailingTests,
          passed:
            (catalogGroupStat[belongingGroup]?.passed || 0) +
            suiteResult.numPassingTests,
          pending:
            (catalogGroupStat[belongingGroup]?.pending || 0) +
            suiteResult.numPendingTests,
          total:
            (catalogGroupStat[belongingGroup]?.total || 0) +
            (suiteResult.numFailingTests +
              suiteResult.numPassingTests +
              suiteResult.numPendingTests),
        };
      });
    });

    Object.keys(catalogGroupStat).forEach((groupName) => {
      this.catalogStat.push({
        type: "group",
        name: groupName,
        test: catalogGroupStat[groupName],
      });
    });

    const htmlString = genReportHTMLString(this.catalogStat);
    fs.writeFileSync(
      path.resolve(this.context["outputDir"], "report.html"),
      htmlString,
      "utf-8"
    );
  }
}

module.exports = CoreReporter;
