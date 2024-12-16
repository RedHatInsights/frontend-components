import { Breadcrumbs } from '../../../src/Breadcrumbs';

describe('Breadcrumbs component', () => {
  const items = [
    { title: 'first', navigate: 'first' },
    { title: 'second', navigate: 'second' },
  ];

  it('renders without any items', () => {
    cy.mount(<Breadcrumbs items={undefined} current={'first'} onNavigate={undefined} />);
    cy.get('.ins-c-breadcrumbs');
  });

  it('renders multiple items correctly', () => {
    cy.mount(<Breadcrumbs items={items} current={'third'} onNavigate={undefined} />);
    cy.get('.pf-v6-c-breadcrumb__list').children().should('have.length', 3);
  });

  it('fires callback when an item is clicked', () => {
    const onNavigateSpy = cy.spy().as('onNavigateSpy');
    cy.mount(<Breadcrumbs items={items} current={'third'} onNavigate={onNavigateSpy} />);
    cy.get('.pf-v6-c-breadcrumb__list > li[data-key="1"] > a').click();
    cy.get('@onNavigateSpy').should('have.been.calledWithMatch', Cypress.sinon.match.object, 'second', 1);
  });
});
