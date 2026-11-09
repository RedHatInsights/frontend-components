import React, { useCallback, useContext, useSyncExternalStore } from 'react';
import {
  IntlContext,
  RawIntlProvider,
  ReactIntlErrorCode,
  FormattedMessage as ReactIntlFormattedMessage,
  createIntl,
  createIntlCache,
} from 'react-intl';
import { loadMessages } from './loadMessages';

// Library components translate themselves. The surrounding provider (Chrome's,
// the app's own, or none) decides the locale, formats and error handling; the
// library loads its own catalog for that locale from its own bundle, so a
// nested provider cannot hide it.

const formatterCache = createIntlCache();
const englishIntl = createIntl({ locale: 'en', messages: {} }, formatterCache);
const NO_MESSAGES = Object.freeze({});
const IDLE = Object.freeze({ messages: NO_MESSAGES, pending: false });
const PENDING = Object.freeze({ messages: NO_MESSAGES, pending: true });

/** Catalog key for a locale; undefined for English or malformed tags, which load nothing. */
const catalogLocale = (locale) => {
  let canonical;
  try {
    [canonical] = Intl.getCanonicalLocales(String(locale).replace(/_/g, '-'));
  } catch {
    return undefined;
  }
  return canonical && canonical.split('-')[0] !== 'en' ? canonical : undefined;
};

/** One shared entry per locale for every library component in this bundle. */
const catalogs = new Map();

const getCatalog = (key) => {
  let catalog = catalogs.get(key);
  if (!catalog) {
    catalog = { state: IDLE, listeners: new Set() };
    catalogs.set(key, catalog);
  }
  return catalog;
};

const peekState = (key) => (key && catalogs.get(key)?.state) || IDLE;

// A locale is requested once per page. An undelivered file or failed chunk
// keeps English defaults until reload rather than retrying on every render.
// Safe to call during render: it never notifies synchronously.
const requestCatalog = (key) => {
  if (!key) return;
  const catalog = getCatalog(key);
  if (catalog.state !== IDLE) return;
  catalog.state = PENDING;
  loadMessages(key).then((messages) => {
    catalog.state = Object.freeze({ messages: messages || NO_MESSAGES, pending: false });
    catalog.listeners.forEach((notify) => notify());
  });
};

// Chrome keeps <html lang> in sync with the console language. Start loading
// while the app bundle starts up, so the catalog has usually arrived before the
// first library component renders instead of flashing English first.
if (typeof document !== 'undefined') {
  requestCatalog(catalogLocale(document.documentElement?.lang || 'en'));
}

// One derived intl per provider intl and catalog state, shared by all
// components under that provider.
const derived = new WeakMap();

const deriveIntl = (intl, state) => {
  if (state.messages !== NO_MESSAGES) {
    // The provider's messages win, so an app can still override a library string.
    return createIntl({ ...intl, messages: { ...state.messages, ...intl.messages } }, formatterCache);
  }
  // While the catalog loads, English defaults are expected, not missing translations.
  return createIntl(
    {
      ...intl,
      onError: (error) => {
        if (error.code !== ReactIntlErrorCode.MISSING_TRANSLATION) intl.onError(error);
      },
    },
    formatterCache,
  );
};

const withLibraryCatalog = (intl, state) => {
  if (state === IDLE || (!state.pending && state.messages === NO_MESSAGES)) return intl;
  const cached = derived.get(intl);
  if (cached?.state === state) return cached.intl;
  const libraryIntl = deriveIntl(intl, state);
  derived.set(intl, { state, intl: libraryIntl });
  return libraryIntl;
};

/**
 * Library intl for non-hook callers (helpers and filter factories). Uses the
 * catalog if it has already loaded and requests it otherwise; it cannot
 * re-render its caller when the catalog arrives later.
 * @param {import('react-intl').IntlShape | null | undefined} [intl] the caller's intl; English when absent
 * @returns {import('react-intl').IntlShape}
 */
export const getIntlWithFallback = (intl = undefined) => {
  const providerIntl = intl || englishIntl;
  const key = catalogLocale(providerIntl.locale);
  requestCatalog(key);
  return withLibraryCatalog(providerIntl, peekState(key));
};

export { IntlContext };
export { defineMessages } from 'react-intl';

/**
 * Library intl that follows the surrounding provider's locale and re-renders once
 * the library catalog for that locale has loaded. English outside a provider.
 * @returns {import('react-intl').IntlShape}
 */
export const useIntlWithFallback = () => {
  const providerIntl = useContext(IntlContext) || englishIntl;
  const key = catalogLocale(providerIntl.locale);
  requestCatalog(key);
  const subscribe = useCallback(
    (notify) => {
      if (!key) return () => undefined;
      const { listeners } = getCatalog(key);
      listeners.add(notify);
      return () => listeners.delete(notify);
    },
    [key],
  );
  const getSnapshot = useCallback(() => peekState(key), [key]);
  return withLibraryCatalog(providerIntl, useSyncExternalStore(subscribe, getSnapshot, getSnapshot));
};

/**
 * React Intl message rendering with the library intl, for provider-free callers
 * and non-hook render helpers.
 * @param {React.ComponentProps<typeof ReactIntlFormattedMessage>} props
 */
export const FormattedMessage = (props) => (
  <RawIntlProvider value={useIntlWithFallback()}>
    <ReactIntlFormattedMessage {...props} />
  </RawIntlProvider>
);
