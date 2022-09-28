const { html, Component } = require("htm/preact");
const reactToString = require("preact-render-to-string");
const fs = require("fs");
const path = require("path");
const TestTable = require("./TestTable");
class Report extends Component {
  render(props) {
    const { name, tests } = props;
    return html`<div>
      <h1>${name}</h1>
      <${TestTable} tests="${tests}" />
      <div></div>
    </div>`;
  }
}

const genReportHTMLString = ({ name, tests }) => {
  const reportBody = reactToString(
    html`<${Report} name="${name}" tests="${tests}" />`
  );

  // load css
  const cssFiles = fs.readdirSync(__dirname).filter((f) => f.endsWith(".css"));
  const cssString = cssFiles.reduce((prev, fileName, index) => {
    prev +=
      fs.readFileSync(path.resolve(__dirname, fileName), "utf-8") + "</style>";
    if (index !== cssFiles.length - 1) prev += "<style>";
    return prev;
  }, "<style>");

  // return html string
  return `<!DOCTYPE html><html>${cssString}<body>${reportBody}</body></html>`;
};

module.exports = genReportHTMLString;
