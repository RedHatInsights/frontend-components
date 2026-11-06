import IntlProvider from '@redhat-cloud-services/frontend-components-translations/Provider';
import React from 'react';

import { IntlProvider as ReactIntlProvider } from 'react-intl';
import { syntheticCatalog } from '../../fixtures/localization';
import Shield from '../../../src/Shield/Shield';
import TableToolbar from '../../../src/TableToolbar/TableToolbar';
import DefaultErrorMessage from '../../../src/ErrorState/DefaultErrorMessage';
import Spinner from '../../../src/Spinner/Spinner';
import Reboot from '../../../src/Reboot/Reboot';
import { TableView } from '../../../src/TableView/TableView';
import { TableViewEmptyState } from '../../../src/TableView/components/TableViewEmptyState';

const columns = ['name'] as const;
const rows = [{ id: '1', name: 'Example' }];
const tableProps = {
  columns,
  columnConfig: { name: { label: 'Name' } },
  getRowId: (row: (typeof rows)[number]) => row.id,
  cellRenderers: { name: (row: (typeof rows)[number]) => row.name },
  page: 1,
  perPage: 10,
  onPageChange: () => {},
  onPerPageChange: () => {},
  selectable: true,
  renderActions: () => <button>Open</button>,
  ariaLabel: 'Example table',
};

function expectColumnLabels(selection: string, actions: string) {
  cy.get('thead th').first().should('have.text', selection);
  cy.get('thead th').last().should('have.text', actions);
}

describe('component localization props without an IntlProvider', () => {
  it('preserves English Spinner and Reboot defaults', () => {
    cy.mount(
      <>
        <Spinner />
        <Reboot />
      </>,
    );
    cy.get('[role="status"]').should('have.text', 'Loading...');
    cy.get('.ins-c-reboot').should('have.text', 'Reboot required');
  });

  it('renders caller-supplied Spinner and Reboot translations', () => {
    cy.mount(
      <>
        <Spinner loadingText="Chargement..." />
        <Reboot text={<span>Redémarrage requis</span>} />
      </>,
    );
    cy.get('[role="status"]').should('have.text', 'Chargement...').and('not.have.attr', 'loadingText');
    cy.get('.ins-c-reboot').should('have.text', 'Redémarrage requis').and('not.have.attr', 'text');
  });

  it('preserves English table column labels', () => {
    cy.mount(<TableView {...tableProps} data={rows} totalCount={1} />);
    expectColumnLabels('Select', 'Actions');
  });

  it('localizes populated table column labels', () => {
    cy.mount(<TableView {...tableProps} data={rows} totalCount={1} selectColumnLabel="Sélectionner" actionsColumnLabel="Opérations" />);
    expectColumnLabels('Sélectionner', 'Opérations');
  });

  it('forwards localized column labels to the no-results table', () => {
    cy.mount(
      <TableView
        {...tableProps}
        data={[]}
        totalCount={0}
        filterConfig={[{ id: 'name', type: 'text', label: 'Name' }]}
        filters={{ name: 'missing' }}
        selectColumnLabel="Sélectionner"
        actionsColumnLabel="Opérations"
      />,
    );
    expectColumnLabels('Sélectionner', 'Opérations');
    cy.contains('No results found').should('exist');
  });

  it('supports localized labels on standalone empty-state tables', () => {
    cy.mount(
      <TableViewEmptyState
        showHeaders
        columnLabels={['Name']}
        hasSelection
        hasActions
        selectColumnLabel="Sélectionner"
        actionsColumnLabel="Opérations"
      >
        No results
      </TableViewEmptyState>,
    );
    expectColumnLabels('Sélectionner', 'Opérations');
  });
});

describe('catalog-backed library defaults', () => {
  it('translates stock defaults and table headers without passing text overrides', () => {
    cy.mount(
      <IntlProvider locale="fr" messages={syntheticCatalog('fr')}>
        <Spinner />
        <Reboot />
        <TableView {...tableProps} data={rows} totalCount={1} />
      </IntlProvider>,
    );
    cy.get('[role="status"]').should('contain.text', '[fr:components.spinner.loadingText]');
    cy.get('.ins-c-reboot').should('contain.text', '[fr:components.reboot.text]');
    cy.get('thead th').first().should('contain.text', '[fr:components.tableView.selectColumnLabel]');
    cy.get('thead th').last().should('contain.text', '[fr:components.tableView.actionsColumnLabel]');
  });

  it('translates default empty-state copy without changing caller-owned column labels', () => {
    cy.mount(
      <IntlProvider locale="fr" messages={syntheticCatalog('fr')}>
        <TableView
          {...tableProps}
          data={[]}
          totalCount={0}
          filterConfig={[{ id: 'name', type: 'text', label: 'Name' }]}
          filters={{ name: 'missing' }}
        />
      </IntlProvider>,
    );
    cy.contains('[fr:components.tableViewEmptyState.defaultEmptyStateNoResultsTitle]').should('exist');
    cy.contains('[fr:components.tableViewEmptyState.defaultEmptyStateNoResultsBody]').should('exist');
    cy.get('thead th').eq(1).should('have.text', 'Name');
  });

  it('preserves caller React content, empty strings, and null overrides', () => {
    cy.mount(
      <IntlProvider locale="fr" messages={syntheticCatalog('fr')}>
        <Spinner loadingText="Caller loading" />
        <Reboot text={<strong>Caller reboot</strong>} />
        <Reboot text="" />
        <Reboot text={null} />
      </IntlProvider>,
    );
    cy.get('[role="status"]').should('have.text', 'Caller loading');
    cy.get('.ins-c-reboot strong').should('have.text', 'Caller reboot');
    cy.get('.ins-c-reboot').eq(1).should('have.text', '');
    cy.get('.ins-c-reboot').eq(2).should('have.text', '');
  });

  it('updates already-mounted defaults and native plural rules when locale changes', () => {
    const Switcher = () => {
      const [locale, setLocale] = React.useState('fr');
      return (
        <>
          <button onClick={() => setLocale('de')}>Switch locale</button>
          <IntlProvider locale={locale} messages={syntheticCatalog(locale)}>
            <Reboot />
            <TableToolbar results={0} />
          </IntlProvider>
        </>
      );
    };
    cy.mount(<Switcher />);
    cy.get('.ins-c-reboot').should('contain.text', '[fr:components.reboot.text]');
    cy.get('.ins-c-table__toolbar-results-count').should('contain.text', '0 Result').and('not.contain.text', '0 Results');
    cy.contains('button', 'Switch locale').click();
    cy.get('.ins-c-reboot').should('contain.text', '[de:components.reboot.text]');
    cy.get('.ins-c-table__toolbar-results-count').should('contain.text', '0 Results');
  });

  it('falls back to the English descriptor under an application provider with missing messages', () => {
    const onError = cy.stub();
    cy.mount(
      <ReactIntlProvider locale="fr" messages={{}} onError={onError}>
        <Spinner />
        <Reboot />
      </ReactIntlProvider>,
    );
    cy.get('[role="status"]').should('have.text', 'Loading...');
    cy.get('.ins-c-reboot').should('have.text', 'Reboot required');
    cy.then(() => expect(onError).to.have.been.called);
  });

  it('keeps severity keys technical and translates visible/accessibility labels', () => {
    cy.mount(
      <IntlProvider locale="fr" messages={{ ...syntheticCatalog('fr'), 'components.shield.impact': 'Critical' }}>
        <Shield impact={undefined!} hasLabel hasTooltip={false} />
      </IntlProvider>,
    );
    cy.get('svg').should('have.attr', 'aria-label', '[fr:components.severity.unknown] Unknown');
    cy.contains('[fr:components.severity.unknown]').should('exist');
    cy.contains('[fr:components.severity.critical]').should('not.exist');
  });

  it('formats rich messages while retaining the original support links', () => {
    cy.mount(
      <IntlProvider locale="fr" messages={syntheticCatalog('fr')}>
        <DefaultErrorMessage />
      </IntlProvider>,
    );
    cy.contains('[fr:components.defaultErrorMessage.support]').should('exist');
    cy.get('a').first().should('have.attr', 'href', 'https://access.redhat.com/support');
    cy.get('a').last().should('have.attr', 'href', 'https://status.redhat.com');
  });
});
