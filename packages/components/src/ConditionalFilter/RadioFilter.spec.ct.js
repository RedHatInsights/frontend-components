import React from 'react';

import Radio from './RadioFilter';

describe('RadioFilter component', () => {
  const config = {
    items: [
      {
        label: 'foo',
        value: 'val1',
      },
      {
        label: 'bar',
        value: 'val2',
      },
    ],
  };

  it('renders empty', () => {
    cy.mount(<Radio />);
    cy.get('.pf-v5-c-menu-toggle');
  });

  it('renders disabled', () => {
    cy.mount(<Radio {...config} isDisabled />);
    cy.get('.pf-v5-c-menu-toggle').should('be.disabled');
  });

  it('renders with data', () => {
    cy.mount(<Radio {...config} />);
    cy.get('.pf-v5-c-menu-toggle').click();
    cy.get('.pf-v5-c-menu ul.pf-v5-c-menu__list').children().should('have.length', 2);
  });

  it('renders with default value and placeholder', () => {
    cy.mount(<Radio {...config} value="val2" placeholder="baz" />);
    cy.get('.pf-v5-c-menu-toggle').click();
    cy.get('.pf-v5-c-menu ul.pf-v5-c-menu__list')
      .children()
      .eq(1)
      .within(() => {
        cy.get('.pf-v5-c-radio__input').should('be.checked');
      });
    cy.get('.pf-v5-c-menu-toggle__text').should('contain', 'baz');
  });

  it('onChange called', () => {
    const changeSpy = cy.spy().as('cSpy');
    cy.mount(<Radio {...config} onChange={changeSpy} />);
    cy.get('.pf-v5-c-menu-toggle').click();
    cy.get('.pf-v5-c-menu ul.pf-v5-c-menu__list').children().eq(1).click();
    cy.get('@cSpy').should('have.been.called');
  });
});
