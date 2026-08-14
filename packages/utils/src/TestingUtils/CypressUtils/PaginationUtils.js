/* global cy */
import { MENU, MENU_ITEM, MENU_TOGGLE, PAGINATION, PAGINATION_TOP } from './selectors';

const DEFAULT_ROW_COUNT = 20;
const PAGINATION_VALUES = [10, 20, 50, 100];
const SORTING_ORDERS = ['ascending', 'descending'];

/**
 * - Checks if the table shows the correct number of items per page.
 * @typedef {Object} itemsPerPage
 * @param {number} totalLength - the length of fixtures array e.g. the amount of items overall.
 * @param {number} pageSize - "items shown" setting of the table, default is 20.
 */
export function itemsPerPage(totalLength, pageSize = DEFAULT_ROW_COUNT) {
  let items = totalLength;
  const array = [];
  while (items > 0) {
    const remain = items - pageSize;
    const v = remain > 0 ? pageSize : items;
    array.push(v);
    items = remain;
  }
  return array;
}

/**
 * - Checks pagination total
 * @typedef {Object} checkPaginationTotal
 * @param {number} n - the length of fixtures array e.g. the amount of items overall.
 */
export function checkPaginationTotal(n) {
  return cy.get(PAGINATION).should('contain.text', `of ${n}`);
}

/**
 * - Checks pagination dropdown values
 * @typedef {Object} checkPaginationValues
 * @param {array} expectedValues - array of strings with pagination values
 */
export function checkPaginationValues(expectedValues) {
  cy.get(PAGINATION_TOP).find(MENU_TOGGLE).click();
  cy.get(MENU)
    .find(MENU_ITEM)
    .each(($el, index) => {
      cy.wrap($el).should('have.text', `${expectedValues[index]} per page`);
    });
}

/**
 * - Changes page limit and check if the URL contains the limit=pagination value
 * @typedef {Object} changePagination
 * @param {array} paginationValue - array of strings with pagination values
 *
 * @example
 * cy.wrap(PAGINATION_VALUES).each((el) => {
 *    changePagination(el).then(() => {
 *      expect(window.location.search).to.contain(`limit=${el}`);
 *    });
 *  });
 */
export function changePagination(paginationValue) {
  cy.get(PAGINATION_TOP).find(MENU_TOGGLE).click();
  return cy.get(MENU).find(MENU_ITEM).contains(`${paginationValue}`).click();
}

export { DEFAULT_ROW_COUNT, PAGINATION_VALUES, SORTING_ORDERS };
