import React from 'react';
import { mount } from '@cypress/react';

import { BulkSelect } from '..';

describe('BulkSelect component', () => {
  const config = {
    items: [
      {
        title: 'Foo',
      },
      {
        title: 'Bar',
        props: {
          isDisabled: true,
        },
      },
    ],
    count: 100,
  };

  it('renders checked component without data', () => {
    mount(<BulkSelect checked={true} />);
    cy.get('.ins-c-bulk-select').find('>input').should('be.checked');
  });

  it('renders component with data', () => {
    mount(<BulkSelect {...config} />);
    cy.get('#toggle-checkbox-text').should('contain.text', '100');
    cy.get('.pf-v5-c-dropdown__toggle-button').click();
    cy.get('.pf-v5-c-dropdown__menu').find('>li>button').should('have.length', 2);
  });

  it('cannot be expanded or checked when disabled', () => {
    mount(<BulkSelect {...config} isDisabled={true} />);
    cy.get('.pf-v5-c-dropdown__toggle-button').click({ force: true });
    cy.get('.pf-v5-c-dropdown__menu').should('not.exist');
    cy.get('#toggle-checkbox').check({ force: true });
    cy.get('#toggle-checkbox').should('not.be.checked');
  });

  it('buttons (do not) respond to being clicked', () => {
    config.items[0].onClick = cy.spy().as('enabledSpy');
    config.items[1].onClick = cy.spy().as('disabledSpy');
    config.onClick = cy.spy().as('checkboxSpy');
    mount(<BulkSelect {...config} />);
    cy.get('.pf-v5-c-dropdown__toggle-button').click();
    cy.get('.pf-v5-c-dropdown__menu').find('>li>button').eq(0).click();
    cy.get('.pf-v5-c-dropdown__toggle-button').click();
    cy.get('.pf-v5-c-dropdown__menu').find('>li>button').eq(1).click({ force: true });
    cy.get('#toggle-checkbox').check();
    cy.get('@enabledSpy').should('have.been.called');
    cy.get('@disabledSpy').should('not.have.been.called');
    cy.get('@checkboxSpy').should('have.been.called');
  });
});
