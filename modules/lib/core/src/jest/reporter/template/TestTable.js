const { html, Component } = require("htm/preact");
const TestCaseTable = require("./TestCaseTable");

class TestTable extends Component {
  render(props) {
    const tests = props.tests;
    return html` <div class="bx--data-table-container" data-table>
      <table class="bx--data-table">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Total</th>
            <th>Passing</th>
            <th>Failing</th>
            <th>Pending</th>
            <th>Todo</th>
            <th>Rate</th>
          </tr>
        </thead>
        <tbody>
          ${tests.map((test) => {
            const {
              name,
              passing,
              failing,
              pending,
              todo,
              filepath,
              groups,
              testCases,
            } = test;
            const total = passing + failing + pending + todo;
            const rate = Math.floor((passing / total) * 100);
            return html`
              <tr class="bx--parent-row" data-parent-row>
                <td></td>
                <td class="bold">${name}</td>
                <td>${passing}</td>
                <td>${failing}</td>
                <td>${pending}</td>
                <td>${todo}</td>
                <td>${total}</td>
                <td class="bold ${rate === 100 ? "rate-pass" : "rate-failed"}">
                  ${rate}%
                </td>
              </tr>
              <tr
                class="bx--expandable-row bx--expandable-row--hidden"
                data-child-row
              >
                <td colspan="12">
                  <h5>File Path</h5>
                  <div class="bx--snippet-container margin-below">
                    <pre><code>${filepath}</code></pre>
                  </div>
                  <h5>Groups</h5>
                  <div>
                    ${groups.map(
                      (group) =>
                        html`<span class="bx--tag bx--tag-group"
                          >${group}</span
                        >`
                    )}
                  </div>
                  <${TestCaseTable} testCases="${testCases}" />
                </td>
              </tr>
            `;
          })}
        </tbody>
      </table>
    </div>`;
  }
}

module.exports = TestTable;
