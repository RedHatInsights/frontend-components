import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider as ReactIntlProvider, addLocaleData } from 'react-intl';
import { LOCALSTORAGE_KEY } from './';
import translatedMessages from '../../../locales/data.json';
import localeEn from 'react-intl/locale-data/en';
import localeCs from 'react-intl/locale-data/cs';

let defaultLocale = [ ...localeEn, ...localeCs ];

const IntlProvider = ({
    locale,
    messages,
    ...props
}) => {
    if (addLocaleData) {
        addLocaleData(defaultLocale);
    }

    const language = locale || localStorage.getItem(LOCALSTORAGE_KEY) || navigator.language.split(/[-_]/)[0] || 'en';
    return (
        <ReactIntlProvider
            locale={ language }
            messages={ {
                ...translatedMessages[language],
                ...messages && messages.hasOwnProperty(language) ? messages[language] : messages
            } }
            { ...props }
        />
    );
};

export const updateLocaleData = (localeData = []) => {
    defaultLocale = [ ...defaultLocale, ...localeData ];
    return defaultLocale;
};

IntlProvider.propTypes = {
    locale: PropTypes.string
};

IntlProvider.defaultProps = {
    locale: null
};

export default IntlProvider;
