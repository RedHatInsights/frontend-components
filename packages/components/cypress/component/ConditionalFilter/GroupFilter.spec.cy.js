import Group from '../../../src/ConditionalFilter/GroupFilter';

describe('GroupFilter component', () => {
  const config = {
    groups: [
      {
        label: 'Group1',
        items: [
          {
            label: 'Item11',
          },
          {
            label: 'Item12',
          },
        ],
      },
      {
        label: 'Group2',
        type: 'radio',
        items: [
          {
            label: 'Item21',
          },
          {
            label: 'Item22',
          },
        ],
      },
      {
        label: 'Group3',
        type: 'checkbox',
        items: [
          {
            label: 'Item31',
          },
          {
            label: 'Item32',
          },
        ],
      },
      {
        label: 'Group4',
        groupSelectable: true,
        items: [
          {
            label: 'Item41',
          },
          {
            label: 'Item42',
          },
        ],
      },
    ],
    items: [
      {
        label: 'Group5',
        type: 'treeView',
        children: [
          {
            label: 'Item51',
          },
          {
            label: 'Item52',
          },
        ],
      },
    ],
  };

  it('renders empty', () => {
    cy.mount(<Group />);
    cy.get('.pf-v6-c-menu-toggle');
  });

  it('renders with placeholder', () => {
    cy.mount(<Group placeholder="foo" />);
    cy.get('.pf-v6-c-menu-toggle__text').should('contain', 'foo');
  });

  it('renders with data', () => {
    cy.mount(<Group {...config} showMoreTitle="hello" onShowMore={() => undefined} />);
    cy.get('.pf-v6-c-menu-toggle__controls').click();
    cy.get('.pf-v6-c-menu__item').should('have.length', 11);
  });

  it('onChange called', () => {
    const ocSpy = cy.spy().as('ocSpy');
    cy.mount(<Group {...config} onChange={ocSpy} />);
    cy.get('.pf-v6-c-menu-toggle__controls').click();
    cy.get('.pf-v6-c-menu__item').eq(5).click();
    cy.get('@ocSpy').should('have.been.called');
  });
});
