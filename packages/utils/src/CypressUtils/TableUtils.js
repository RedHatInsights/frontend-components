/* global cy, Cypress */
import _ from 'lodash';

import { ROW, TABLE, TBODY, TITLE } from './selectors';

export function checkTableHeaders(expectedHeaders) {
  /* patternfly/react-table-4.71.16, for some reason, renders extra empty `th` container;
    thus, it is necessary to look at the additional `scope` attr to distinguish between visible columns
    */
  return cy
    .get('table th[scope="col"]')
    .then(($els) => {
      return _.map(Cypress.$.makeArray($els), 'innerText');
    })
    .should('deep.equal', expectedHeaders);
}

export function checkRowCounts(n, isSelectableTable = false) {
  return isSelectableTable ? cy.get('table').find(TBODY).should('have.length', n) : cy.get('table').find(TBODY).find(ROW).should('have.length', n);
}

export function columnName2UrlParam(name) {
  return name.toLowerCase().replace(/ /g, '_');
}

export function tableIsSortedBy(columnTitle) {
  return cy.get('table').find(`th[data-label="${columnTitle}"]`).should('have.class', 'pf-c-table__sort pf-m-selected');
}

export function checkEmptyState(title, checkIcon = false) {
  checkRowCounts(1);
  cy.get(TABLE)
    // @ts-ignore
    // NEED TO FIX type error here
    .ouiaId('empty-state')
    .should('have.length', 1)
    .within(() => {
      cy.get('.pf-c-empty-state__icon').should('have.length', checkIcon ? 1 : 0);
      cy.get(`h5${TITLE}`).should('have.text', title);
    });
}
