import React, { useContext } from 'react';
import { IntlContext, RawIntlProvider, FormattedMessage as ReactIntlFormattedMessage, createIntl, createIntlCache } from 'react-intl';

const englishIntl = createIntl({ locale: 'en', messages: {} }, createIntlCache());

/** @param {import('react-intl').IntlShape | null | undefined} [intl] */
export const getIntlWithFallback = (intl = undefined) => intl || englishIntl;

export { IntlContext };
export { defineMessages } from 'react-intl';

/** Use the application's locale, retaining English behavior outside a provider. */
export const useIntlWithFallback = () => getIntlWithFallback(useContext(IntlContext));

/**
 * React Intl message rendering for provider-free callers and non-hook render helpers.
 * @param {React.ComponentProps<typeof ReactIntlFormattedMessage>} props
 */
export const FormattedMessage = (props) => (
  <RawIntlProvider value={useIntlWithFallback()}>
    <ReactIntlFormattedMessage {...props} />
  </RawIntlProvider>
);
