import Maintenance from '../../../src/Maintenance';
import TableToolbar from '../../../src/TableToolbar';

describe('localized library defaults', () => {
  [
    [{}, 'unavailable from 10am to 12am UTC (6am-8am EST).'],
    [{ startTime: '12am', endTime: '2am' }, 'unavailable from 10am to 12am UTC (12am-2am EST).'],
  ].forEach(([props, text]) => {
    it(`preserves Maintenance text: ${text}`, () => {
      cy.mount(<Maintenance {...props} />);
      cy.contains(text).should('be.visible');
    });
  });
  [0, 1, 2].forEach((selected) => {
    it(`preserves English selection text for ${selected}`, () => {
      cy.mount(<TableToolbar selected={selected} />);
      cy.get('.ins-c-table__toolbar-results-selected').should('have.text', ` ${selected} Selected `);
    });
  });
});
