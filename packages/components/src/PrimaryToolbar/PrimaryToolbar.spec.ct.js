import React from 'react';
import { mount } from '@cypress/react';

import { PrimaryToolbar } from '..';
import { Button } from '@patternfly/react-core';

describe('PrimaryToolbar component', () => {
  const groupConfig = {
    expandAll: {
      asAllExpanded: false,
      isDisabled: false,
    },
    bulkSelect: {
      items: [
        {
          title: 'Foo',
        },
        {
          title: 'Bar',
        },
      ],
      checked: false,
    },
    filterConfig: {
      items: [
        {
          label: 'Baz',
          type: 'radio',
          filterValues: {
            items: [
              {
                label: 'One',
              },
              {
                label: 'Two',
              },
            ],
          },
        },
        {
          label: 'Waldo',
        },
      ],
    },
    dedicatedAction: <button type="button">Qux</button>,
  };
  const otherConfig = {
    actionsConfig: {
      actions: [<Button key="btn">Bar</Button>],
      dropdownProps: { className: 'ddClass' },
    },
    sortByConfig: {
      direction: 'asc',
    },
    pagination: {
      itemCount: 100,
      page: 1,
      perPage: 15,
    },
    activeFiltersConfig: {
      filters: [
        {
          name: 'Filter1',
        },
      ],
    },
  };

  it('renders empty toolbar with class and id', () => {
    mount(<PrimaryToolbar id="myToolbar" className="tbPrimary" />);
    cy.get('.ins-c-primary-toolbar').should('have.id', 'myToolbar').should('have.class', 'tbPrimary');
  });

  it('renders items correctly - only one item', () => {
    mount(<PrimaryToolbar filterConfig={groupConfig.filterConfig} />);
    cy.get('.pf-c-toolbar__group').get('.ins-c-primary-toolbar__filter');
  });

  it('renders items correctly - only group', () => {
    mount(<PrimaryToolbar {...groupConfig} />);
    cy.get('.pf-c-toolbar__group').children().should('have.length', 4);
  });

  it('renders items correctly - only items outside of the group', () => {
    mount(<PrimaryToolbar {...otherConfig} />);
    cy.get('.pf-c-toolbar__content-section').children().should('have.length', 5);
  });

  it('renders items correctly - everything', () => {
    mount(<PrimaryToolbar {...groupConfig} {...otherConfig} />);
    cy.get('.pf-c-toolbar__content-section')
      .within(() => {
        cy.get('.pf-c-toolbar__group').children().should('have.length', 4);
      })
      .children()
      .should('have.length', 6);
  });

  it('responds to interaction with individual items', () => {
    groupConfig.expandAll.onClick = cy.spy().as('eaSpy');
    groupConfig.bulkSelect.items[1].onClick = cy.spy().as('bsSpy');
    otherConfig.activeFiltersConfig.onDelete = cy.spy().as('afSpy');
    mount(<PrimaryToolbar {...groupConfig} {...otherConfig} />);
    cy.get('[data-ouia-component-id="ExpandCollapseAll"]').click();
    cy.get('button[data-ouia-component-id="BulkSelect"]').click();
    cy.get(':nth-child(2) > .pf-c-dropdown__menu-item').click();
    cy.get('[data-ouia-component-id="ClearFilters"]').click();
    cy.get('@eaSpy').should('have.been.called');
    cy.get('@bsSpy').should('have.been.called');
    cy.get('@afSpy').should('have.been.called');
  });
});
