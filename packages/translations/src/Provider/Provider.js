import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider as ReactIntlProvider } from 'react-intl';
import { LOCALSTORAGE_KEY } from '../utils';
import translatedMessages from '../generated/data.json';

const getLocaleMessages = (catalogs, locale) => {
  if (!catalogs) return undefined;
  const normalizedLocale = locale.toLowerCase();
  const keys = Object.keys(catalogs);
  const key =
    keys.find((key) => key.replace(/_/g, '-').toLowerCase() === normalizedLocale) ||
    keys.find((key) => key.toLowerCase() === normalizedLocale.split('-')[0]);
  const localeMessages = key ? catalogs[key] : undefined;
  return localeMessages && typeof localeMessages === 'object' && !Array.isArray(localeMessages) ? localeMessages : undefined;
};

const IntlProvider = ({ locale = null, messages, ...props }) => {
  const language = (locale || localStorage.getItem(LOCALSTORAGE_KEY) || navigator.language || 'en').replace(/_/g, '-');
  return (
    <ReactIntlProvider
      locale={language}
      messages={{
        ...translatedMessages.en,
        ...getLocaleMessages(translatedMessages, language),
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
