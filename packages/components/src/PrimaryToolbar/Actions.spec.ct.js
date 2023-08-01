import React from 'react';
import { mount } from '@cypress/react';

import { Actions } from '..';

describe('Actions component', () => {
  const config = {
    actions: [
      {
        label: 'Foo',
        props: {
          key: 'obj1',
        },
      },
      {
        label: 'Bar',
        props: {
          key: 'obj2',
        },
      },
      'Baz',
    ],
    overflowActions: [
      'Qux',
      {
        label: 'Waldo',
        props: {
          key: 'obj2',
        },
      },
    ],
  };

  it('empty component is not rendered', () => {
    mount(<Actions />);
    cy.get('.ins-c-primary-toolbar__actions').should('not.exist');
  });

  it('renders component with data', () => {
    mount(<Actions {...config} />);
    cy.get('.ins-c-primary-toolbar__actions');
    cy.get('.pf-v5-c-dropdown__toggle').click();
    cy.get('.pf-v5-c-dropdown__menu').find('>li>button').should('have.length', 5);
  });

  it('functions called on click', () => {
    config.actions[0].onClick = cy.spy().as('firstActionSpy');
    config.actions[1].onClick = cy.spy().as('restActionsSpy');
    config.overflowActions[1].onClick = cy.spy().as('ofActionSpy');
    mount(<Actions {...config} />);
    cy.get('.pf-v5-c-button').click();
    cy.get('.pf-v5-c-dropdown__toggle').click();
    cy.get('.pf-v5-c-dropdown__menu').find('>li>button').eq(1).click();
    cy.get('.pf-v5-c-dropdown__toggle').click();
    cy.get('.pf-v5-c-dropdown__menu').find('>li>button').eq(4).click();
    cy.get('@firstActionSpy').should('have.been.called');
    cy.get('@restActionsSpy').should('have.been.called');
    cy.get('@ofActionSpy').should('have.been.called');
  });
});
