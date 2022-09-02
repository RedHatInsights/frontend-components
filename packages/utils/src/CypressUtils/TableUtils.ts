//need the following line to explain typescript that cy is = to cypress
/// <reference types="cypress" />
// @ts-nocheck
import _ from 'lodash';

import { CHIP, CHIP_GROUP, ROW, TABLE, TBODY, TITLE } from './UIConstants';
import { applyFilters, removeAllChips } from './UIFilters';

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
    .ouiaId('empty-state')
    .should('have.length', 1)
    .within(() => {
      cy.get('.pf-c-empty-state__icon').should('have.length', checkIcon ? 1 : 0);
      cy.get(`h5${TITLE}`).should('have.text', title);
    });
}

export function checkNoMatchingClusters() {
  return checkEmptyState('No matching clusters found');
}

export function checkNoMatchingRecs() {
  return checkEmptyState('No matching recommendations found');
}

/**
 * Check filtering works by removing all existing chips, adding some filters,
 * validating the data, and the chips.
 *
 * @param {*} filters - object with filters and their config
 * @param {@FiltersConf} filtersConf
 * @param {*} values - array of values to compare
 * @param {string} columnName - identifier of the column to be used to validate data
 * @param {*} tableHeaders - header of the table
 * @param {string} emptyStateTitle - title to check on empty state
 * @param {boolean} validateURL - whether to validate URL parameters
 */

interface FiltersValue {
  name: string;
}

interface FiltersConfValueName {
  filterFunc: () => void;
  selectorText: string;
  type: string;
  values: string[];
}

interface FiltersConfValueVersion {
  filterfunc: () => void;
  selectorText: string;
  type: string;
  values: string[];
}

interface FiltersConfValue {
  name: FiltersConfValueName;
  version: FiltersConfValueVersion;
}

export function checkFiltering(
  filters: FiltersValue,
  filtersConf: FiltersConfValue,
  values: string[],
  columnName: string,
  tableHeaders: string[],
  emptyStateTitle: string,
  validateURL: boolean,
  hasDefaultFilters: boolean
) {
  if (hasDefaultFilters) {
    removeAllChips();
  }
  applyFilters(filters, filtersConf);

  if (values.length === 0) {
    checkEmptyState(emptyStateTitle);
    checkTableHeaders(tableHeaders);
  } else {
    cy.get(`td[data-label="${columnName}"]`)
      .then(($els) => {
        return _.map(Cypress.$.makeArray($els), 'innerText');
      })
      .should('deep.equal', values);
  }

  // validate chips and url params
  cy.get(CHIP_GROUP)
    .should('have.length', Object.keys(filters).length)
    .then(() => {
      if (validateURL) {
        for (const [k, v] of Object.entries(filtersConf)) {
          if (k in filters) {
            const urlValue = v.urlValue(filters[k]);
            expect(window.location.search).to.contain(`${v.urlParam}=${urlValue}`);
          } else {
            expect(window.location.search).to.not.contain(`${v.urlParam}=`);
          }
        }
      }
    });

  // check chips
  for (const [k, v] of Object.entries(filters)) {
    const groupName = filtersConf[k].selectorText;
    const nExpectedItems = filtersConf[k].type === 'checkbox' ? v.length : 1;
    cy.get(CHIP_GROUP)
      .contains(groupName)
      .parents(CHIP_GROUP)
      .then((chipGroup) => {
        cy.wrap(chipGroup).find(CHIP).its('length').should('be.eq', Math.min(3, nExpectedItems)); // limited to show 3
      });
  }
  cy.get('button').contains('Reset filters').should('exist');
}

/**
 * A column is sorted and then data and a reference column (which can be different than the
 * sorting one) are compared to see if order matches
 *
 * @param {Object} data - following order from API response and complemented with any
 * modification needed
 * @param {*} sortingField - key in the data to sort by, or function
 * @param {string} label - identifier of the column
 * @param {string} order - ascending or descending
 * @param {string} columnField - identifier of the column to be used in the comparison with the data
 * @param {string} dataField - key in the data to be used in the comparison with the data
 * @param {integer} nExpectedRows - number of expected rows to be displayed in the table
 * @param {string} validateURL - string expected as sort value in URL. If not provided, it is not checked
 */
export function checkSorting(data, sortingField, label, order, columnField, dataField, nExpectedRows, validateURL) {
  // get appropriate locators
  const col = `td[data-label="${label}"]`;
  const header = `th[data-label="${label}"]`;

  // check number of rows
  cy.get(col).should('have.length', nExpectedRows);

  // sort by column and verify URL
  if (order === 'ascending') {
    cy.get(header)
      .find('button')
      .click()
      .then(() => {
        if (validateURL) {
          expect(window.location.search).to.contain(`sort=${columnName2UrlParam(validateURL)}`);
        }
      });
  } else {
    cy.get(header)
      .find('button')
      .click()
      .click() // TODO dblclick fails for unknown reason in RecsListTable when sorting by Clusters
      .then(() => {
        if (validateURL) {
          expect(window.location.search).to.contain(`sort=-${columnName2UrlParam(validateURL)}`);
        }
      });
  }

  const sortedValues = _.map(_.orderBy(data, [sortingField], [order === 'descending' ? 'desc' : 'asc']), dataField);
  cy.get(`td[data-label="${columnField}"]`)
    .then(($els) => {
      return _.map(Cypress.$.makeArray($els), 'innerText');
    })
    .should('deep.equal', sortedValues.slice(0, nExpectedRows));
}
