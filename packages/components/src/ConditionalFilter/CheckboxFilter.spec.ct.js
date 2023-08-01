import React from 'react';
import { mount } from '@cypress/react';

import Checkbox from './CheckboxFilter';

describe('CheckboxFilter component', () => {
  it('renders empty', () => {
    mount(<Checkbox />);
    cy.get('.ins-c-conditional-filter');
  });

  it('renders with correct attributes', () => {
    mount(<Checkbox placeholder="foo" isDisabled />);
    cy.get('.ins-c-conditional-filter').invoke('attr', 'placeholder').should('contain', 'foo');
    cy.get('.ins-c-conditional-filter').should('be.disabled');
  });

  it('default value is set', () => {
    mount(<Checkbox value={['foo']} items={[{ label: 'one' }, { label: 'two' }]} />);
    cy.get('.pf-v5-c-select__toggle').click();
    cy.get('.pf-v5-c-select__menu').children().should('have.length', 2);
    cy.get('.pf-v5-c-select__toggle-badge').should('contain', '1');
  });

  it('onChange called', () => {
    const onChangeSpy = cy.spy().as('ocSpy');
    mount(<Checkbox items={[{ label: 'one' }, { label: 'two' }]} onChange={onChangeSpy} />);
    cy.get('.pf-v5-c-select__toggle').click();
    cy.get('.pf-v5-c-select__menu > :nth-child(1)').click();
    cy.get('@ocSpy').should('have.been.called');
  });
});
