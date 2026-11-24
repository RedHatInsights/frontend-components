import React from 'react';
import PropTypes from 'prop-types';
import { act, renderHook, waitFor } from '@testing-library/react';
import { loadMessages } from './loadMessages';

jest.mock('./loadMessages', () => ({ loadMessages: jest.fn().mockResolvedValue(undefined) }));
import { IntlProvider, ReactIntlErrorCode, createIntl, createIntlCache } from 'react-intl';
import { getIntlWithFallback, useIntlWithFallback } from './localization';

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

  test('preloads requested console language independently of html lang without rendering', () => {
    const lang = document.documentElement.lang;
    const consoleLanguage = document.documentElement.getAttribute('data-console-language');
    try {
      document.documentElement.lang = 'en';
      document.documentElement.setAttribute('data-console-language', 'fr');
      jest.isolateModules(() => {
        const loader = require('./loadMessages').loadMessages;
        require('./localization');
        expect(loader).toHaveBeenCalledTimes(1);
        expect(loader).toHaveBeenCalledWith('fr');
      });
    } finally {
      document.documentElement.lang = lang;
      if (consoleLanguage === null) document.documentElement.removeAttribute('data-console-language');
      else document.documentElement.setAttribute('data-console-language', consoleLanguage);
    }
  });
});

describe('optional-provider localization', () => {
  test('reuses the provider-free English formatter', () => {
    expect(getIntlWithFallback()).toBe(getIntlWithFallback(null));
    expect(getIntlWithFallback().locale).toBe('en');
  });
});
