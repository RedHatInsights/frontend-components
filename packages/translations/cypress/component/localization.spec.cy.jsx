import { useState } from 'react';
import { mount } from 'cypress/react18';
import { IntlProvider } from 'react-intl';
import { FormattedMessage, useIntlWithFallback } from '../../src/localization';
import { setLoader } from '../fixtures/loadMessages';

const Status = () => {
  const intl = useIntlWithFallback();
  const text = intl.formatMessage({ id: 'test.loading', defaultMessage: 'Loading {count} items' }, { count: 2 });
  return <span aria-label={text}>{text}</span>;
};
const LocaleSwitcher = () => {
  const [locale, setLocale] = useState('fr');
  return (
    <>
      <button onClick={() => setLocale('de')}>Switch locale</button>
      <IntlProvider
        locale={locale}
        messages={{ 'test.loading': locale === 'fr' ? 'Chargement de {count} éléments' : '{count} Elemente werden geladen' }}
      >
        <Status />
      </IntlProvider>
    </>
  );
};

describe('optional-provider rendering', () => {
  beforeEach(() => setLoader(async () => undefined));

  it('resolves render-prop accessibility strings when a default element renders', () => {
    const fallback = (
      <FormattedMessage id="test.fallback" defaultMessage="Loading">
        {(chunks) => <span aria-label={chunks.join('')} />}
      </FormattedMessage>
    );
    mount(
      <IntlProvider locale="fr" messages={{ 'test.fallback': '[fr] loading' }}>
        {fallback}
      </IntlProvider>,
    );
    cy.get('[aria-label="[fr] loading"]').should('exist');
  });
  it('formats English without a provider', () => {
    mount(<Status />);
    cy.contains('Loading 2 items').should('have.attr', 'aria-label', 'Loading 2 items');
  });
  it('follows provider locale and message changes', () => {
    mount(<LocaleSwitcher />);
    cy.contains('Chargement de 2 éléments').should('have.attr', 'aria-label', 'Chargement de 2 éléments');
    cy.contains('button', 'Switch locale').click();
    cy.contains('2 Elemente werden geladen').should('have.attr', 'aria-label', '2 Elemente werden geladen');
  });
  it('preserves rich text and plurals without a provider', () => {
    mount(
      <FormattedMessage
        id="test.rich"
        defaultMessage="{count, plural, one {# item} other {# items}}: <strong>{name}</strong>"
        values={{ count: 2, name: 'Example', strong: (chunks) => <strong>{chunks}</strong> }}
      />,
    );
    cy.get('[data-cy-root]').should('have.text', '2 items: Example');
    cy.contains('strong', 'Example').should('be.visible');
  });
  it('renders translations and English descriptors for missing messages', () => {
    mount(
      <IntlProvider locale="fr" messages={{ 'test.present': 'Enregistré' }} onError={() => {}}>
        <FormattedMessage id="test.present" defaultMessage="Saved" />
        <FormattedMessage id="test.missing" defaultMessage="Missing translation" />
      </IntlProvider>,
    );
    cy.get('[data-cy-root]').should('have.text', 'EnregistréMissing translation');
  });
});
