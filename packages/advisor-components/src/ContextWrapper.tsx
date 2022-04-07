import React from 'react';
import { IntlProvider } from 'react-intl';

import en_translation from './compiled-lang/en.json';

export const translations: Record<string, Record<string, string>> = {
  en: en_translation,
};

export interface ContextWrapperProps {
  /**
   * routerProps - passed to Router from react-router-dom
   */
  children: React.ReactNode;
}

const ContextWrapper: React.FC<ContextWrapperProps> = ({ children }) => {
  const locale = navigator.language.slice(0, 2);

  return (
    <IntlProvider locale={locale} messages={translations[locale]}>
      {children}
    </IntlProvider>
  );
};

export default ContextWrapper;
