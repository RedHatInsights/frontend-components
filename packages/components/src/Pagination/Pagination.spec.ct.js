import React from 'react';
import { mount } from '@cypress/react';

import { Pagination } from '..';

describe('Pagination component', () => {
  it('renders with default values', () => {
    mount(<Pagination />);
    cy.get('.pf-c-pagination').within(() => {
      cy.get('.pf-c-options-menu__toggle').should('contain', '10');
      cy.get('.pf-c-pagination__nav-page-select > span').should('contain', '1');
    });
  });

  it('renders with data', () => {
    mount(<Pagination numberOfItems={100} perPageOptions={[5, 10, 15, 25]} />);
    cy.get('.pf-c-pagination').within(() => {
      cy.get('.pf-c-options-menu__toggle').should('contain', '5');
      cy.get('.pf-c-pagination__nav-page-select > span').should('contain', '20');
      cy.get('.pf-c-options-menu__toggle').click();
      cy.get('.pf-c-dropdown__menu').find('>li>button').should('have.length', 4);
    });
  });

  it('no items', () => {
    mount(<Pagination numberOfItems={0} />);
    cy.get('.pf-c-options-menu__toggle').should('contain', '0 - 0');
    cy.get('[data-action="next-page"]').should('be.disabled');
    cy.get('[data-action="previous-page"]').should('be.disabled');
  });

  it('onPerPageSelect should be called', () => {
    const selectSpy = cy.spy().as('perPageSpy');
    mount(<Pagination numberOfItems={5} perPageOptions={[5, 10, 15, 25]} onPerPageSelect={selectSpy} />);
    cy.get('.pf-c-options-menu__toggle').click();
    cy.get('.pf-c-dropdown__menu').find('>li>button').eq(1).click({ force: true });
    cy.get('.pf-c-options-menu__toggle').click();
    cy.get('.pf-c-dropdown__menu').find('>li>button').eq(2).click({ force: true });
    cy.get('@perPageSpy').should('have.callCount', 2);
  });

  it('onSetPage should be called', () => {
    const setSpy = cy.spy().as('setPageSpy');
    mount(<Pagination numberOfItems={100} itemsPerPage={4} page={10} onSetPage={setSpy} />);
    cy.get('.pf-c-form-control').type('1');
    cy.get('[data-action="next-page"]').click();
    cy.get('[data-action="last-page"]').click();
    cy.get('[data-action="previous-page"]').click();
    cy.get('[data-action="first-page"]').click();
    cy.get('@setPageSpy').should('have.callCount', 5);
  });
});
