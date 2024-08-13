/* global cy, Cypress */
//to make Cypress commands available you need to initialize them in the file where you import them
//import { findElementByOuiaId } from 'x';
//findElementByOuiaId()
//after that the cypress command is available in the entire file
/**
 * this functions adds a .ouiaId command that allows to better find elements by the ouiaId
 * - ouiaId accepts 3 parameters: (subject, item, el = '')
 * @example
 * ${el}[data-ouia-component-id="${item}"]
 * if the subject is true it wraps it and finds ${el}[data-ouia-component-id="${item}"]
 * otherwise it runs cy.get(${el}[data-ouia-component-id="${item}"])
 * @typedef {function} findElementByOuiaId
 *
 */
export function findElementByOuiaId() {
  Cypress.Commands.add('ouiaId', { prevSubject: 'optional' }, (subject, item, el = '') => {
    const attr = `${el}[data-ouia-component-id="${item}"]`;
    return subject ? cy.wrap(subject).find(attr) : cy.get(attr);
  });
}
/**
 * this functions adds a .ouiaType command that allows to better find elements by the ouiaType
 * ouiaType accepts 3 parameters: (subject, item, el = '')
 * @example
 * ${el}[data-ouia-component-type="${item}"]
 * if the subject is true it wraps it and finds ${el}[data-ouia-component-type="${item}"]
 * otherwise it runs cy.get(${el}[data-ouia-component-type="${item}"])
 * @typedef {function} findElementByOuiaType
 *
 */
export function findElementByOuiaType() {
  Cypress.Commands.add('ouiaType', { prevSubject: 'optional' }, (subject, item, el = '') => {
    const attr = `${el}[data-ouia-component-type="${item}"]`;
    return subject ? cy.wrap(subject).find(attr) : cy.get(attr);
  });
}
