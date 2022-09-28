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

    this.groupTestData = {};
    this.testsList = [];

    if (
      !this.context["outputDir"] ||
      !fs.existsSync(this.context["outputDir"])
    ) {
      throw new Error("require report option: 'outputDir' doesnt exist");
    }
    this.outputDir = this.context["outputDir"];
    this.groupReportOutputDir = path.resolve(this.outputDir, "groups-report");
  }

  onRunComplete(_testContexts, aggregatedResult) {
    const allTestData = { name: "All", tests: [] };
    for (const test of aggregatedResult.testResults) {
      const testGroups = getGroupFromPragmas(test.testFilePath);
      const testCases = [];

      for (const testCase of test.testResults) {
        testCases.push({
          name: testCase.title,
          status: testCase.status,
          duration: testCase.duration,
          invocations: testCase.invocations,
        });
      }

      const testData = {
        name: test?.testResults?.[0]?.ancestorTitles?.[0],
        passing: test.numPassingTests,
        failing: test.numFailingTests,
        pending: test.numPendingTests,
        todo: test.numTodoTests,
        filepath: test.testFilePath,
        groups: testGroups,
        testCases,
      };

      for (const group of testGroups) {
        if (!this.groupTestData[group]) {
          this.groupTestData[group] = { name: group, tests: [] };
        }
        this.groupTestData[group].tests.push(testData);
      }

      allTestData.tests.push(testData);
    }

    // write overall report
    fs.writeFileSync(
      path.resolve(this.outputDir, "report.html"),
      genReportHTMLString(allTestData),
      "utf8"
    );

    // write groups report
    if (!fs.existsSync(this.groupReportOutputDir)) {
      fs.mkdirSync(this.groupReportOutputDir, { recursive: true });
    }

    Object.keys(this.groupTestData).forEach((group) => {
      fs.writeFileSync(
        path.resolve(this.groupReportOutputDir, `${group}.html`),
        genReportHTMLString(this.groupTestData[group]),
        "utf8"
      );
    });
  }
}

module.exports = CoreReporter;
