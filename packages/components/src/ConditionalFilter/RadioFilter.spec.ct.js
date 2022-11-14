import React from 'react';
import { mount } from '@cypress/react';

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
    mount(<Radio />);
    cy.get('.ins-c-conditional-filter');
  });

  it('renders disabled', () => {
    mount(<Radio {...config} isDisabled />);
    cy.get('.pf-c-select__toggle').should('be.disabled');
  });

  it('renders with data', () => {
    mount(<Radio {...config} />);
    cy.get('.pf-c-select__toggle').click();
    cy.get('.pf-c-select__menu').children().should('have.length', 2);
  });

  it('renders with default value and placeholder', () => {
    mount(<Radio {...config} value="val2" placeholder="baz" />);
    cy.get('.pf-c-select__toggle').click();
    cy.get('.pf-c-select__menu')
      .children()
      .eq(1)
      .within(() => {
        cy.get('.pf-c-radio__input').should('be.checked');
      });
    cy.get('.pf-c-select__toggle-text').should('contain', 'baz');
  });

  it('onChange called', () => {
    const changeSpy = cy.spy().as('cSpy');
    mount(<Radio {...config} onChange={changeSpy} />);
    cy.get('.pf-c-select__toggle').click();
    cy.get('.pf-c-select__menu').children().eq(1).click();
    cy.get('@cSpy').should('have.been.called');
  });
});
