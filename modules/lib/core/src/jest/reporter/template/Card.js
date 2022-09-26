const { html, Component } = require("htm/preact");

class Card extends Component {
  render(props) {
    return html`<div class="bx--col-lg-3 bx--col-md-4 bx--col-sm-2 core--card">
      <div class="core--card-content">
        <h3 class="core--card-title">${props.name}</h3>
        <div class="core--card-data-wrapper bx--row">
          <span class="core--card-data-title bx--col-sm-2">total:</span>
          <span class="core--card-data-data bx--col-sm-2">${props.total}</span>
        </div>
        <div class="core--card-data-wrapper bx--row">
          <span class="core--card-data-title bx--col-sm-2">passed:</span>
          <span class="core--card-data-data bx--col-sm-2">${props.passed}</span>
        </div>
        <div class="core--card-data-wrapper bx--row">
          <span class="core--card-data-title bx--col-sm-2">failed:</span>
          <span class="core--card-data-data bx--col-sm-2">${props.failed}</span>
        </div>
        <div class="core--card-data-wrapper bx--row">
          <span class="core--card-data-title bx--col-sm-2">pending:</span>
          <span class="core--card-data-data bx--col-sm-2"
            >${props.pending}</span
          >
        </div>
      </div>
    </div>`;
  }
}

module.exports = Card;
