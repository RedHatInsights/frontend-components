import Checkbox from '../../../src/ConditionalFilter';

// needs fixes
describe.skip('CheckboxFilter component', () => {
  it('renders empty', () => {
    cy.mount(<Checkbox />);
    cy.get('.pf-v6-c-toolbar__toggle');
  });

  it('renders with correct attributes', () => {
    cy.mount(<Checkbox placeholder="foo" isDisabled />);
    cy.get('.pf-v6-c-toolbar__toggle').should('contain', 'foo');
    cy.get('.pf-v6-c-menu-toggle').should('be.disabled');
  });

  it('default value is set', () => {
    cy.mount(
      <Checkbox
        // @ts-ignore
        value={['foo']}
        items={[
          { filterValues: { onChange: () => undefined }, label: 'one', type: 'text' },
          { filterValues: { onChange: () => undefined }, label: 'two', type: 'text' },
        ]}
      />
    );
    cy.get('.pf-v6-c-menu-toggle').click();
    cy.get('.pf-v6-c-menu__list').children().should('have.length', 2);
    cy.get('.pf-v6-c-badge').should('contain', '1');
  });

  it('onChange called', () => {
    const onChangeSpy = cy.spy().as('ocSpy');
    cy.mount(
      <Checkbox
        items={[
          { filterValues: { onChange: () => undefined }, label: 'one', type: 'text' },
          { filterValues: { onChange: () => undefined }, label: 'two', type: 'text' },
        ]}
        onChange={onChangeSpy}
      />
    );
    cy.get('.pf-v6-c-menu-toggle').click();
    cy.get('.pf-v6-c-menu__list > :nth-child(1)').click();
    cy.get('@ocSpy').should('have.been.called');
  });
});
