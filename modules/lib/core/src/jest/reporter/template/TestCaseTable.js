const { html, Component } = require("htm/preact");

class TestCaseTable extends Component {
  render(props) {
    const testCases = props.testCases;
    return html` <div class="bx--data-table-container" data-table>
      <table class="bx--data-table">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Status</th>
            <th>Duration</th>
            <th>Invocations</th>
          </tr>
        </thead>
        <tbody>
          ${testCases.map((testCase) => {
            const { name, status, duration, invocations } = testCase;
            const durationSec = duration / 1000;
            return html`
              <tr class="bx--parent-row" data-parent-row>
                <td></td>
                <td class="bold">${name}</td>
                <td>
                  <span class="bx--tag bx--tag-${status}">${status}</span>
                </td>
                <td>${durationSec}s</td>
                <td>${invocations}</td>
              </tr>
            `;
          })}
        </tbody>
      </table>
    </div>`;
  }
}

module.exports = TestCaseTable;
