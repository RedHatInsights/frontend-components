//need the following line to explain typescript that cy is = to cypress
/// <reference types="cypress" />
// @ts-nocheck
import { DEFAULT_ROW_COUNT, DROPDOWN_ITEM, DROPDOWN_TOGGLE, PAGINATION_MENU, TOOLBAR } from './UIConstants';

// FIXME improve syntax
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

export function checkPaginationTotal(n) {
  return cy.get('.pf-c-options-menu__toggle-text').find('b').eq(1).should('have.text', n);
}

export function checkPaginationValues(expectedValues) {
  cy.get(TOOLBAR).find(PAGINATION_MENU).find(DROPDOWN_TOGGLE).click();
  cy.get(TOOLBAR)
    .find(PAGINATION_MENU)
    .find('ul[class=pf-c-options-menu__menu]')
    .find('li')
    .each(($el, index) => {
      cy.wrap($el).should('have.text', `${expectedValues[index]} per page`);
    });
}

export function changePagination(textInItem) {
  cy.get(TOOLBAR).find(PAGINATION_MENU).find(DROPDOWN_TOGGLE).click();
  return cy.get(TOOLBAR).find(PAGINATION_MENU).find('ul[class=pf-c-options-menu__menu]').find(DROPDOWN_ITEM).contains(`${textInItem}`).click();
}
