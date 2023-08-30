import React from 'react';

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
    cy.mount(<BulkSelect checked={true} />);
    cy.get('.ins-c-bulk-select').find('>input').should('be.checked');
  });

  it('renders component with data', () => {
    cy.mount(<BulkSelect {...config} />);
    cy.get('#toggle-checkbox').should('contain.text', '100');
    cy.get('.pf-v5-c-menu-toggle').click();
    // PF has one extra hidden button element
    cy.get('.pf-v5-c-menu__list').find('>li>button').should('have.length', 3);
  });

  it('cannot be expanded or checked when disabled', () => {
    cy.mount(<BulkSelect {...config} isDisabled={true} />);
    cy.get('.pf-v5-c-menu-toggle').click({ force: true });
    cy.get('.pf-v5-c-menu__list').should('not.exist');
    cy.get('input[name="toggle-checkbox"]').check({ force: true });
    cy.get('input[name="toggle-checkbox"]').should('not.be.checked');
  });

  it('buttons (do not) respond to being clicked', () => {
    config.items[0].onClick = cy.spy().as('enabledSpy');
    config.items[1].onClick = cy.spy().as('disabledSpy');
    config.onClick = cy.spy().as('checkboxSpy');
    cy.mount(<BulkSelect {...config} />);
    cy.get('.pf-v5-c-menu-toggle').click();
    cy.get('.pf-v5-c-menu__list').find('>li>button').eq(1).click();
    cy.get('.pf-v5-c-menu-toggle').click();
    cy.get('.pf-v5-c-menu__list').find('>li>button').eq(2).click({ force: true });
    cy.get('input[name="toggle-checkbox"]').check();
    cy.get('@enabledSpy').should('have.been.called');
    cy.get('@disabledSpy').should('not.have.been.called');
    cy.get('@checkboxSpy').should('have.been.called');
  });
});
