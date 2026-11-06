import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { IntlProvider as ReactIntlProvider } from 'react-intl';
import { LOCALSTORAGE_KEY } from '../utils';
import defaultMessages from '../messages';
import { loadMessages } from '../loadMessages';

// Retain the original ID-only API. New library UI descriptors supply their own
// English defaultMessage, so fallback plurals use defaultLocale, not the target locale.
const legacyEnglishMessages = Object.fromEntries(Object.values(defaultMessages).map(({ id, defaultMessage }) => [id, defaultMessage]));

const isEnglish = (language) => language.split('-')[0].toLowerCase() === 'en';

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
  const [loaded, setLoaded] = useState({});

  useEffect(() => {
    let cancelled = false;
    loadMessages(language).then((catalog) => {
      if (!cancelled) setLoaded({ language, messages: catalog });
    });
    return () => {
      cancelled = true;
    };
  }, [language]);

  return (
    <ReactIntlProvider
      locale={language}
      // An English variant (en-US, en-GB) is the source language: rendering defaultMessage
      // is correct, not a missing translation, so it must not raise MISSING_TRANSLATION.
      defaultLocale={isEnglish(language) ? language : 'en'}
      messages={{
        ...legacyEnglishMessages,
        ...(loaded.language === language ? loaded.messages : undefined),
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
