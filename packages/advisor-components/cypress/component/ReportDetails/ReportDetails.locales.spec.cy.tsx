import IntlProvider from '@redhat-cloud-services/frontend-components-translations/Provider';
import { useState } from 'react';
import { ReportDetails } from '../../../src/ReportDetails';
import report from '../../fixtures/report.json';

const policies = ['PCI DSS – production & recovery', 'Policy <em>literal</em> {policy}'];
const messageId = 'advisorComponents.reportDetails.conflictingPolicy';
const props = {
  report: {
    ...report,
    details: {
      ...report.details,
      conflict_compliance_policies_enabled: Object.fromEntries(policies.map((policy) => [policy, true])),
    },
  },
  kbaDetail: { id: '', view_uri: '', publishedTitle: 'N/A' },
  kbaLoading: false,
  isProd: true,
};

const ConflictReport = () => (
  <div data-testid="conflicting-policies">
    <ReportDetails {...props} />
  </div>
);

const expectPolicies = (prefix: string) => {
  cy.get('[data-testid="conflicting-policies"]')
    .find('li')
    .should(($items) => {
      const text = Array.from($items, (item) => item.textContent).filter((value) => value?.startsWith(prefix));
      expect(text).to.deep.equal(policies.map((policy) => `${prefix}${policy}`));
    });
  cy.contains('li', policies[1]).find('em').should('not.exist');
};

const LocaleSwitcher = () => {
  const [locale, setLocale] = useState('fr');
  return (
    <>
      <button onClick={() => setLocale('de')}>Switch locale</button>
      {/* Synthetic catalogs only: the locale marker makes translation selection observable. */}
      <IntlProvider locale={locale} messages={{ [messageId]: `[${locale}] {policy}` }}>
        <ConflictReport />
      </IntlProvider>
    </>
  );
};

describe('ReportDetails conflicting policy localization', () => {
  it('renders English without a provider and preserves policy names as literal text', () => {
    cy.mount(<ConflictReport />);
    expectPolicies('Conflicting policy: ');
  });

  it('formats the translated whole message while preserving every policy name', () => {
    cy.mount(
      <IntlProvider locale="fr" messages={{ [messageId]: '[fr] {policy}' }}>
        <ConflictReport />
      </IntlProvider>,
    );
    expectPolicies('[fr] ');
  });

  it('falls back to the English descriptor when the target translation is absent', () => {
    cy.mount(
      <IntlProvider locale="fr" messages={{}}>
        <ConflictReport />
      </IntlProvider>,
    );
    expectPolicies('Conflicting policy: ');
  });

  it('updates policy messages when the active locale changes', () => {
    cy.mount(<LocaleSwitcher />);
    expectPolicies('[fr] ');
    cy.contains('button', 'Switch locale').click();
    expectPolicies('[de] ');
  });
});
