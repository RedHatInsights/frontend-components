import React from 'react';
import PropTypes from 'prop-types';
import { act, render, renderHook, waitFor } from '@testing-library/react';
import { loadMessages } from './loadMessages';

jest.mock('./loadMessages', () => ({ loadMessages: jest.fn().mockResolvedValue(undefined) }));
import { IntlProvider, ReactIntlErrorCode, createIntl, createIntlCache } from 'react-intl';
import { FormattedMessage, getIntlWithFallback, useIntlWithFallback } from './localization';

const message = { id: 'test.loading', defaultMessage: 'Loading {count} items' };

function Status() {
  const intl = useIntlWithFallback();
  return <span aria-label={intl.formatMessage(message, { count: 2 })}>{intl.formatMessage(message, { count: 2 })}</span>;
}

describe('library-owned catalogs', () => {
  const descriptor = { id: 'library.test', defaultMessage: 'English' };
  const wrapper = (locale, props = {}) => {
    function Provider({ children }) {
      return (
        <IntlProvider locale={locale} {...props}>
          {children}
        </IntlProvider>
      );
    }
    Provider.propTypes = { children: PropTypes.node };
    return Provider;
  };
  const deferred = () => {
    let resolve;
    const promise = new Promise((done) => {
      resolve = done;
    });
    loadMessages.mockReturnValueOnce(promise);
    return resolve;
  };

  beforeEach(() => loadMessages.mockClear());

  test('loads library messages under an app provider', async () => {
    const resolve = deferred();
    const { result } = renderHook(useIntlWithFallback, { wrapper: wrapper('fr-FR') });
    expect(result.current.formatMessage(descriptor)).toBe('English');
    await act(async () => resolve({ 'library.test': 'Bibliothèque' }));
    await waitFor(() => expect(result.current.formatMessage(descriptor)).toBe('Bibliothèque'));
  });

  test('app messages override the loaded library catalog', async () => {
    const resolve = deferred();
    const { result } = renderHook(useIntlWithFallback, { wrapper: wrapper('de-DE', { messages: { 'library.test': 'App' } }) });
    await act(async () => resolve({ 'library.test': 'Library', 'library.only': 'Loaded' }));
    await waitFor(() => expect(result.current.messages['library.only']).toBe('Loaded'));
    expect(result.current.formatMessage(descriptor)).toBe('App');
  });

  test('preserves provider formats, timeZone and non-missing error handling', async () => {
    const resolve = deferred();
    const onError = jest.fn();
    const formats = { number: { precise: { minimumFractionDigits: 3 } } };
    const { result } = renderHook(useIntlWithFallback, { wrapper: wrapper('ja-JP', { formats, timeZone: 'Asia/Tokyo', onError }) });
    await act(async () => resolve({ 'library.test': 'Loaded' }));
    await waitFor(() => expect(result.current.messages['library.test']).toBe('Loaded'));
    expect(result.current.formatNumber(2, { format: 'precise' })).toBe('2.000');
    expect(result.current.timeZone).toBe('Asia/Tokyo');
    result.current.formatMessage({ id: 'broken', defaultMessage: '{unclosed' });
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: ReactIntlErrorCode.FORMAT_ERROR }));
  });

  test('suppresses only missing errors while pending and restores an undelivered provider', async () => {
    const resolve = deferred();
    const onError = jest.fn();
    const provider = createIntl({ locale: 'ko-KR', messages: {}, onError });
    const pending = getIntlWithFallback(provider);
    pending.formatMessage(descriptor);
    expect(onError).not.toHaveBeenCalled();
    const error = { code: ReactIntlErrorCode.FORMAT_ERROR };
    pending.onError(error);
    expect(onError).toHaveBeenCalledWith(error);
    await act(async () => resolve(undefined));
    expect(getIntlWithFallback(provider)).toBe(provider);
  });

  test('shares one request across hook consumers and helper calls', async () => {
    const resolve = deferred();
    const provider = createIntl({ locale: 'es-ES', messages: {} });
    renderHook(useIntlWithFallback, { wrapper: wrapper('es-ES') });
    renderHook(useIntlWithFallback, { wrapper: wrapper('es-ES') });
    getIntlWithFallback(provider);
    getIntlWithFallback(provider);
    expect(loadMessages).toHaveBeenCalledTimes(1);
    expect(loadMessages).toHaveBeenCalledWith('es-ES');
    await act(async () => resolve(undefined));
  });

  test('never requests English or provider-free catalogs', () => {
    renderHook(useIntlWithFallback);
    renderHook(useIntlWithFallback, { wrapper: wrapper('en') });
    renderHook(useIntlWithFallback, { wrapper: wrapper('en-US') });
    getIntlWithFallback();
    getIntlWithFallback(createIntl({ locale: 'en-US', messages: {} }));
    expect(loadMessages).not.toHaveBeenCalled();
  });

  test('helper uses current snapshot and caches the derived intl', async () => {
    const resolve = deferred();
    const provider = createIntl({ locale: 'it-IT', messages: {} }, createIntlCache());
    const pending = getIntlWithFallback(provider);
    expect(pending.formatMessage(descriptor)).toBe('English');
    expect(getIntlWithFallback(provider)).toBe(pending);
    await act(async () => resolve({ 'library.test': 'Libreria' }));
    const loaded = getIntlWithFallback(provider);
    expect(loaded.formatMessage(descriptor)).toBe('Libreria');
    expect(getIntlWithFallback(provider)).toBe(loaded);
    expect(loaded).not.toBe(pending);
  });

  test('preloads html lang without rendering', () => {
    const lang = document.documentElement.lang;
    try {
      document.documentElement.lang = 'fr';
      jest.isolateModules(() => {
        const loader = require('./loadMessages').loadMessages;
        require('./localization');
        expect(loader).toHaveBeenCalledTimes(1);
        expect(loader).toHaveBeenCalledWith('fr');
      });
    } finally {
      document.documentElement.lang = lang;
    }
  });
});

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
