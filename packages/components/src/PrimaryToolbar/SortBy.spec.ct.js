import React from 'react';
import { mount } from '@cypress/react';

import { SortBy } from '..';

describe('SortBy component', () => {
  it('renders empty component', () => {
    mount(<SortBy />);
    cy.get('.pf-v5-c-button');
  });

  it('renders with direction set', () => {
    mount(<SortBy direction="desc" />);
    cy.get('.pf-v5-c-button');
  });

  it('onSortChange is called', () => {
    const sortSpy = cy.spy().as('sortSpy');
    mount(<SortBy direction="desc" onSortChange={sortSpy} />);
    cy.get('.pf-v5-c-button').click();
    cy.get('@sortSpy').should('have.been.called');
  });
});
