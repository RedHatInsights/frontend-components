import React from 'react';
import { mount } from '@cypress/react';

import { Breadcrumbs } from '..';

describe("Breadcrumbs component", () => {
    const items = [
        { title: 'first', navigate: 'first' },
        { title: 'second', navigate: 'second' },
      ];

    it('renders without any items', () => {
        mount(<Breadcrumbs items={undefined} current={"first"} onNavigate={undefined} />)
        cy.get('.ins-c-breadcrumbs');
      });

    it('renders multiple items correctly', () => {
        mount(<Breadcrumbs items={items} current={"third"} onNavigate={undefined} />);
        cy.get('.pf-c-breadcrumb__list').children().should('have.length', 3);
    });

    it('fires callback when an item is clicked', () => {
        const onNavigateSpy = cy.spy().as('onNavigateSpy');
        mount(<Breadcrumbs items={items} current={"third"} onNavigate={onNavigateSpy} />);
        cy.get('.pf-c-breadcrumb__list > li[data-key="1"] > a').click();
        cy.get('@onNavigateSpy').should('have.been.calledWithMatch', Cypress.sinon.match.object, "second", 1);
    })
});
