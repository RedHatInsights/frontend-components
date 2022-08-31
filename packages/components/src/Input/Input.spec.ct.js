import React from 'react';
import { mount } from '@cypress/react';
import { Input } from '..';


describe('Input component', () => {
  
  it('renders the checkbox input', () => {
    mount(<Input widget-id="some-id" type="checkbox" />);
    cy.get('.pf-c-check');
  });

  it('renders the radio input', () => {
    mount(<Input widget-id="some-id" type="radio" />);
    cy.get('.pf-c-check');
  });

  it('renders the text input', () => {
    mount(<Input widget-id="some-id" />);
    cy.get('.pf-c-form-control');
  });

  it('checks the radio functionality', () => {
    mount(
    <div>
      <Input widget-id="some-id" type="radio" name="testradio" value="val1" /> 
      <Input widget-id="some-id2" type="radio" name="testradio" value="val2" />
    </div>);
    cy.get('[widget-id="some-id"]').check().should('be.checked');
    cy.get('[widget-id="some-id2"]').should('not.be.checked');
  });

  it('checks the checkbox functionality', () => {
    mount(
    <div>
      <Input widget-id="some-id" type="checkbox" value="val1" /> 
      <Input widget-id="some-id2" type="checkbox" value="val2" />
    </div>);
    cy.get('[widget-id="some-id"]').check();
    cy.get('[widget-id="some-id2"]').check();
    cy.get('[widget-id="some-id"]').should('be.checked');
    cy.get('[widget-id="some-id2"]').should('be.checked');
    cy.get('[widget-id="some-id2"]').uncheck().should('not.be.checked');
  });

  it('checks the text input functionality', () => {
    mount(<Input widget-id="some-id" />);
    cy.get('[widget-id="some-id"]').type("TestValue").should('have.value', 'TestValue');
  });
});
