import React from 'react';
import { mount } from '@cypress/react';

import ConditionalFilter from './ConditionalFilter';

describe('ConditionalFilter component', () => {
  const config = [
    {
      label: 'text',
    },
    {
      label: 'checkbox',
      type: 'checkbox',
      filterValues: {
        items: [
          {
            label: 'cfilter1',
          },
          {
            label: 'cfilter2',
          },
        ],
      },
    },
    {
      label: 'radio',
      type: 'radio',
      filterValues: {
        items: [
          {
            label: 'rfilter1',
          },
          {
            label: 'rfilter2',
          },
        ],
      },
    },
    {
      label: 'group',
      type: 'group',
      filterValues: {
        groups: [
          {
            label: 'group1',
            type: 'checkbox',
            groupSelectable: true,
            items: [
              {
                label: 'gcitem1',
                type: 'checkbox',
              },
              {
                label: 'gcitem2',
                type: 'checkbox',
              },
            ],
          },
        ],
      },
    },
  ];

  it('renders empty', () => {
    mount(<ConditionalFilter />);
    cy.get('.ins-c-conditional-filter');
  });

  it('renders disabled', () => {
    mount(<ConditionalFilter isDisabled items={config} />);
    cy.get('.pf-v5-c-dropdown').click({ force: true });
    cy.get('.pf-v5-c-dropdown__menu').should('not.exist');
  });

  it('renders with data', () => {
    mount(<ConditionalFilter items={config} />);
    cy.get('.ins-c-conditional-filter');
    cy.get('.pf-v5-c-dropdown').click();
    cy.get('.pf-v5-c-dropdown__menu').children().should('have.length', 4);
  });

  it('filter changes on click', () => {
    mount(<ConditionalFilter items={config} />);
    cy.get('.pf-v5-c-dropdown').click();
    cy.get('.pf-v5-c-dropdown__menu').children().eq(1).click();
    cy.get('.pf-v5-c-dropdown').should('not.contain.text', 'Text');
    cy.get('.pf-v5-c-select').click();
    cy.get('.pf-v5-c-select__menu');
  });

  it('onChange called', () => {
    const ocSpy = cy.spy().as('ocSpy');
    mount(<ConditionalFilter items={config} onChange={ocSpy} />);
    cy.get('.pf-v5-c-dropdown').click();
    cy.get('.pf-v5-c-dropdown__menu').children().eq(2).click();
    cy.get('@ocSpy').should('have.been.called');
  });
});
