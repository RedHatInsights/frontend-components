import React from 'react';
import { IntlProvider } from 'react-intl';
import { Router } from 'react-router-dom';
import { History } from 'history';

import en_translation from './compiled-lang/en.json';

export const translations: Record<string, Record<string, string>> = {
  en: en_translation,
};

export interface ContextWrapperProps {
  /**
   * routerProps - passed to Router from react-router-dom
   */
  routerProps?: {
    history: History;
  };
  children: React.ReactNode;
}

const ContextWrapper: React.FC<ContextWrapperProps> = ({ routerProps, children }) => {
  const locale = navigator.language.slice(0, 2);

  return routerProps ? (
    <Router {...routerProps}>
      <IntlProvider locale={locale} messages={translations[locale]}>
        {children}
      </IntlProvider>
    </Router>
  ) : (
    <IntlProvider locale={locale} messages={translations[locale]}>
      {children}
    </IntlProvider>
  );
};

export default ContextWrapper;
