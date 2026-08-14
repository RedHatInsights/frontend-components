/* global cy, Cypress */
import _ from 'lodash';
import { EMPTY_STATE, EMPTY_STATE_ICON, EMPTY_STATE_TITLE, TABLE, TABLE_ROW, TABLE_ROW_CHECKBOX } from './selectors';

/**
 * - Check the table column headers to be equal to provided array of objects.
 * @typedef {Object} checkTableHeaders
 * @param {string} expectedHeaders - Array of objects with titles. Each title = string
 */
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

/**
 * - Check if the table setting of "rows shown" is equal to the passed number parameter.
 * @typedef {Object} checkRowCounts
 * @param {number} n - number of rows
 */
export function checkRowCounts(n) {
  cy.get('table').find(TABLE_ROW).should('have.length', n);
}
/**
 * - Checks the URL for the name of the column which sorting is "active".
 * @typedef {Object} columnName2UrlParam
 * @param {string} name - column name string
 */
export function columnName2UrlParam(name) {
  return name.toLowerCase().replace(/ /g, '_');
}
/**
 * - Check the table sorting by the passed string parameter.
 *   Doesn't work with the sorting on the backend.
 * @typedef {Object} tableIsSortedBy
 * @param {string} columnTitle - column title string
 */
export function tableIsSortedBy(columnTitle) {
  return cy.get('table').find(`th[data-label="${columnTitle}"]`).should('have.class', 'pf-v6-c-table__sort pf-m-selected');
}
/**
 * - Check the empty state message by the passed string parameter.
 *   Optionally checks for the "checkIcon" if you pass true as a second parameter.
 * @typedef {Object} checkEmptyState
 * @param {string} title
 * @param {boolean} checkIcon
 */
export function checkEmptyState(title, checkIcon = false) {
  checkRowCounts(1);
  cy.get(TABLE)
    // NEED TO FIX type error here
    .find(EMPTY_STATE)
    .should('have.length', 1)
    .within(() => {
      cy.get(EMPTY_STATE_ICON).should('have.length', checkIcon ? 1 : 0);
      cy.get(EMPTY_STATE_TITLE).should('have.text', title);
    });
}

export const selectRowN = (number) => {
  cy.get(TABLE_ROW_CHECKBOX).eq(number).click();
};

export const checkSelectedNumber = (number, selector = '#toggle-checkbox') => {
  if (number === 0) {
    cy.get(selector).should('not.exist');
  } else {
    cy.get(selector).should('have.text', `${number} selected`);
  }
};
