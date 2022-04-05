import React from 'react';
import { IntlProvider } from 'react-intl';
import { Router } from 'react-router-dom';
import { History } from 'history';

import { AdvisorProduct } from './types';

export const translations: Record<string, Record<string, string>> = {
  en: require('../../compiled-lang/en.json'),
};

export interface ContextWrapperProps {
  /**
   * routerProps - passed to Router from react-router-dom
   */
  routerProps?: {
    history: History;
  };
  env: AdvisorProduct;
  children: React.ReactNode;
}

export const ProductContext = React.createContext(AdvisorProduct.rhel);

const ContextWrapper: React.FC<ContextWrapperProps> = ({ routerProps, env, children }) => {
  const locale = navigator.language.slice(0, 2);

  return routerProps ? (
    <Router {...routerProps}>
      <IntlProvider locale={locale} messages={translations[locale]}>
        <ProductContext.Provider value={env}>{children}</ProductContext.Provider>
      </IntlProvider>
    </Router>
  ) : (
    <IntlProvider locale={locale} messages={translations[locale]}>
      <ProductContext.Provider value={env}>{children}</ProductContext.Provider>
    </IntlProvider>
  );
};

export default ContextWrapper;
