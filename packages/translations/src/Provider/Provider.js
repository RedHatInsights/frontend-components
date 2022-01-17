import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider as ReactIntlProvider } from 'react-intl';
import { LOCALSTORAGE_KEY } from '..';
import translatedMessages from '../locales/data.json';

const IntlProvider = ({ locale, messages, ...props }) => {
  const language = locale || localStorage.getItem(LOCALSTORAGE_KEY) || navigator.language.split(/[-_]/)[0] || 'en';
  return (
    <ReactIntlProvider
      locale={language}
      messages={{
        ...translatedMessages[language],
        ...(messages && messages.hasOwnProperty(language) ? messages[language] : messages),
      }}
      {...props}
    />
  );
};

IntlProvider.propTypes = {
  locale: PropTypes.string,
  messages: PropTypes.object,
};

IntlProvider.defaultProps = {
  locale: null,
};

export default IntlProvider;
