import React from 'react';
import { mount } from '@cypress/react';

import Text from './TextFilter';

describe('TextFilter component', () => {
  it('renders empty', () => {
    mount(<Text />);
    cy.get('.ins-c-conditional-filter');
  });

  it('renders disabled with placeholder', () => {
    mount(<Text placeholder="foo" isDisabled />);
    cy.get('.ins-c-conditional-filter').should('be.disabled');
    cy.get('.ins-c-conditional-filter').invoke('attr', 'placeholder').should('contain', 'foo');
  });

  it('onChange called', () => {
    const ocSpy = cy.spy().as('cSpy');
    mount(<Text onChange={ocSpy} />);
    cy.get('.ins-c-conditional-filter').type('foo');
    cy.get('@cSpy').should('have.been.called');
  });
});
