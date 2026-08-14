import { DownloadButton } from '../../../src/DownloadButton';

describe('DownloadButton component', () => {
  beforeEach(() => {
    cy.mount(<DownloadButton />);
  });

  it('renders the dropdown', () => {
    cy.get('.pf-v6-c-menu-toggle');
  });

  it('on download CSV callback fired', () => {
    // Arrange
    const onSelectSpy = cy.spy().as('onSelectSpy');
    cy.mount(<DownloadButton onSelect={onSelectSpy} />);
    // Act
    cy.get('button[aria-label="Export"]').click();
    cy.get('.pf-v6-c-menu__content > ul > li[data-ouia-component-id="DownloadCSV"]').click();
    // Assert
    cy.get('@onSelectSpy').should('have.been.called.with', 'csv');
  });

  it('on download JSON callback fired', () => {
    // Arrange
    const onSelectSpy = cy.spy().as('onSelectSpy');
    cy.mount(<DownloadButton onSelect={onSelectSpy} />);
    // Act
    cy.get('button[aria-label="Export"]').click();
    cy.get('.pf-v6-c-menu__content > ul > li[data-ouia-component-id="DownloadJSON"]').click();
    // Assert
    cy.get('@onSelectSpy').should('have.been.called.with', 'json');
  });
});
