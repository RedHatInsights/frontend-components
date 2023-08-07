import React from 'react';

import Checkbox from './CheckboxFilter';

describe('CheckboxFilter component', () => {
  it('renders empty', () => {
    cy.mount(<Checkbox />);
    cy.get('.pf-v5-c-menu-toggle');
  });

  it('renders with correct attributes', () => {
    cy.mount(<Checkbox placeholder="foo" isDisabled />);
    cy.get('.pf-v5-c-menu-toggle__text').should('contain', 'foo');
    cy.get('.pf-v5-c-menu-toggle').should('be.disabled');
  });

  it('default value is set', () => {
    cy.mount(<Checkbox value={['foo']} items={[{ label: 'one' }, { label: 'two' }]} />);
    cy.get('.pf-v5-c-menu-toggle').click();
    cy.get('.pf-v5-c-menu__list').children().should('have.length', 2);
    cy.get('.pf-v5-c-badge').should('contain', '1');
  });

  it('onChange called', () => {
    const onChangeSpy = cy.spy().as('ocSpy');
    cy.mount(<Checkbox items={[{ label: 'one' }, { label: 'two' }]} onChange={onChangeSpy} />);
    cy.get('.pf-v5-c-menu-toggle').click();
    cy.get('.pf-v5-c-menu__list > :nth-child(1)').click();
    cy.get('@ocSpy').should('have.been.called');
  });
});
