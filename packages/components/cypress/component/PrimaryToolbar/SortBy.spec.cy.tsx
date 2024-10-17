import { SortByDirection } from '@patternfly/react-table';
import { SortBy } from '../../../src/PrimaryToolbar';

describe('SortBy component', () => {
  it('renders empty component', () => {
    cy.mount(<SortBy />);
    cy.get('.pf-v5-c-button');
  });

  it('renders with direction set', () => {
    cy.mount(<SortBy direction={SortByDirection.asc} />);
    cy.get('.pf-v5-c-button');
  });

  it('onSortChange is called', () => {
    const sortSpy = cy.spy().as('sortSpy');
    cy.mount(<SortBy direction={SortByDirection.desc} onSortChange={sortSpy} />);
    cy.get('.pf-v5-c-button').click();
    cy.get('@sortSpy').should('have.been.called');
  });
});
