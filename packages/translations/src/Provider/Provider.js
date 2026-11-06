import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { IntlProvider as ReactIntlProvider } from 'react-intl';
import { LOCALSTORAGE_KEY } from '../utils';
import defaultMessages from '../messages';
import { messageCatalogs } from '../messageCatalogs';

// Retain the original ID-only API. New library UI descriptors supply their own
// English defaultMessage, so fallback plurals use defaultLocale, not the target locale.
const legacyEnglishMessages = Object.fromEntries(Object.values(defaultMessages).map(({ id, defaultMessage }) => [id, defaultMessage]));

const getLocaleKey = (catalogs, locale) => {
  if (!catalogs) return undefined;
  const normalizedLocale = locale.toLowerCase();
  const keys = Object.keys(catalogs);
  return (
    keys.find((key) => key.replace(/_/g, '-').toLowerCase() === normalizedLocale) ||
    keys.find((key) => key.toLowerCase() === normalizedLocale.split('-')[0])
  );
};

const getLocaleMessages = (catalogs, locale) => {
  const key = getLocaleKey(catalogs, locale);
  const localeMessages = key ? catalogs[key] : undefined;
  return localeMessages && typeof localeMessages === 'object' && !Array.isArray(localeMessages) ? localeMessages : undefined;
};

const IntlProvider = ({ locale = null, messages, ...props }) => {
  const language = (locale || localStorage.getItem(LOCALSTORAGE_KEY) || navigator.language || 'en').replace(/_/g, '-');
  const catalogLocale = getLocaleKey(messageCatalogs, language);
  const [loaded, setLoaded] = useState({});

  useEffect(() => {
    if (!catalogLocale) return;
    let cancelled = false;
    messageCatalogs[catalogLocale]().then(
      (module) => {
        if (!cancelled) setLoaded({ locale: catalogLocale, messages: module.default });
      },
      () => {
        if (!cancelled) setLoaded({ locale: catalogLocale });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [catalogLocale]);

  return (
    <ReactIntlProvider
      locale={language}
      defaultLocale="en"
      messages={{
        ...legacyEnglishMessages,
        ...(loaded.locale === catalogLocale ? loaded.messages : undefined),
        ...(getLocaleMessages(messages, language) || messages),
      }}
      {...props}
    />
  );
};

IntlProvider.propTypes = {
  locale: PropTypes.string,
  messages: PropTypes.object,
};

export default IntlProvider;
