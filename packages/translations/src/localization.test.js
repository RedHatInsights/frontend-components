import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { FormattedMessage, getIntlWithFallback, useIntlWithFallback } from './localization';

const message = { id: 'test.loading', defaultMessage: 'Loading {count} items' };

function Status() {
  const intl = useIntlWithFallback();
  return <span aria-label={intl.formatMessage(message, { count: 2 })}>{intl.formatMessage(message, { count: 2 })}</span>;
}

describe('optional-provider localization', () => {
  test('reuses the provider-free English formatter', () => {
    expect(getIntlWithFallback()).toBe(getIntlWithFallback(null));
    expect(getIntlWithFallback().locale).toBe('en');
  });

  test('resolves render-prop accessibility strings when a default element is rendered, not when it is created', () => {
    const fallback = (
      <FormattedMessage id="test.fallback" defaultMessage="Loading">
        {(chunks) => <span aria-label={chunks.join('')} />}
      </FormattedMessage>
    );
    const { getByLabelText } = render(
      <IntlProvider locale="fr" messages={{ 'test.fallback': '[fr] loading' }}>
        {fallback}
      </IntlProvider>,
    );
    expect(getByLabelText('[fr] loading')).toBeTruthy();
  });

  test('formats English strings without a provider', () => {
    const { getByText } = render(<Status />);
    expect(getByText('Loading 2 items').getAttribute('aria-label')).toBe('Loading 2 items');
  });

  test('uses current provider and follows locale/message changes', () => {
    const { getByText, rerender } = render(
      <IntlProvider locale="fr" messages={{ 'test.loading': 'Chargement de {count} éléments' }}>
        <Status />
      </IntlProvider>,
    );
    expect(getByText('Chargement de 2 éléments').getAttribute('aria-label')).toBe('Chargement de 2 éléments');
    rerender(
      <IntlProvider locale="de" messages={{ 'test.loading': '{count} Elemente werden geladen' }}>
        <Status />
      </IntlProvider>,
    );
    expect(getByText('2 Elemente werden geladen')).toBeTruthy();
  });

  test('retains React Intl rich-message and plural behavior without a provider', () => {
    const { getByText, container } = render(
      <FormattedMessage
        id="test.rich"
        defaultMessage="{count, plural, one {# item} other {# items}}: <strong>{name}</strong>"
        values={{ count: 2, name: 'Example', strong: (chunks) => <strong>{chunks}</strong> }}
      />,
    );
    expect(container.textContent).toBe('2 items: Example');
    expect(getByText('Example').tagName).toBe('STRONG');
  });

  test('renders translated messages and falls back to the English descriptor for missing messages', () => {
    const { container } = render(
      <IntlProvider locale="fr" messages={{ 'test.present': 'Enregistré' }} onError={() => {}}>
        <FormattedMessage id="test.present" defaultMessage="Saved" />
        <FormattedMessage id="test.missing" defaultMessage="Missing translation" />
      </IntlProvider>,
    );
    expect(container.textContent).toBe('EnregistréMissing translation');
  });
});
