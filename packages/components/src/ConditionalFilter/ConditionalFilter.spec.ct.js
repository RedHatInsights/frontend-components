import React from 'react';

import ConditionalFilter from './ConditionalFilter';

describe('ConditionalFilter component', () => {
  const config = [
    {
      type: 'text',
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
    cy.mount(<ConditionalFilter />);
    cy.get('.ins-c-conditional-filter');
  });

  it('renders disabled', () => {
    cy.mount(<ConditionalFilter isDisabled items={config} />);
    cy.get('.pf-v5-c-menu-toggle').click({ force: true });
    cy.get('.pf-v5-c-menu__item').should('not.exist');
  });

  it('renders with data', () => {
    cy.mount(<ConditionalFilter items={config} />);
    cy.get('.ins-c-conditional-filter');
    cy.get('.pf-v5-c-menu-toggle').click();
    cy.get('.pf-v5-c-menu__item').children().should('have.length', 4);
  });

  it('filter changes on click', () => {
    cy.mount(<ConditionalFilter items={config} />);
    cy.get('.pf-v5-c-menu-toggle').click();
    cy.get('.pf-v5-c-menu__item').children().eq(1).click();
    cy.get('.pf-v5-c-menu-toggle').should('not.contain.text', 'Text');
    cy.get('.pf-m-fill > .pf-v5-c-menu-toggle').click();
    cy.get('.pf-v5-c-menu');
  });

  it('onChange called', () => {
    const ocSpy = cy.spy().as('ocSpy');
    cy.mount(<ConditionalFilter items={config} onChange={ocSpy} />);
    cy.get('.pf-v5-c-menu-toggle').click();
    cy.get('.pf-v5-c-menu__item').children().eq(2).click();
    cy.get('@ocSpy').should('have.been.called');
  });
});
