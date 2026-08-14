import Text from '../../../src/ConditionalFilter/TextFilter';

describe('TextFilter component', () => {
  it('renders empty', () => {
    cy.mount(<Text />);
    cy.get('.ins-c-conditional-filter');
  });

  it('renders disabled with placeholder', () => {
    cy.mount(<Text placeholder="foo" isDisabled />);
    cy.get('.ins-c-conditional-filter input').should('be.disabled');
    cy.get('.ins-c-conditional-filter input').invoke('attr', 'placeholder').should('contain', 'foo');
  });

  it('onChange called', () => {
    const ocSpy = cy.spy().as('cSpy');
    cy.mount(<Text onChange={ocSpy} />);
    cy.get('.ins-c-conditional-filter').type('foo');
    cy.get('@cSpy').should('have.been.called');
  });
});
