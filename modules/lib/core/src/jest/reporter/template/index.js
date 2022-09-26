const { html, Component } = require("htm/preact");
const reactToString = require("preact-render-to-string");
const fs = require("fs");
const path = require("path");
const Card = require("./Card");

// TODO
class Report extends Component {
  render(props) {
    return html`<div class="bx--row">
      ${props.cards.map(
        (card) =>
          html`<${Card}
            name="${card.name}"
            total="${card.total}"
            passed="${card.passed}"
            failed="${card.failed}"
            pending="${card.pending}"
          />`
      )}
    </div>`;
  }
}

const genReportHTMLString = (catalogStat) => {
  // decompose card data
  const cardData = catalogStat.map((stat) => ({
    name: stat.name ? `@${stat.type}/${stat.name}` : stat.type,
    failed: stat.test.failed,
    passed: stat.test.passed,
    total: stat.test.total,
    pending: stat.test.pending,
  }));
  const reportBody = reactToString(
    html`<${Report} cards="${cardData}"></${Report}>`
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
