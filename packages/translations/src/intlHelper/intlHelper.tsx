import React from 'react';
import IntlProvider from '../Provider';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const intlHelper = (message: any, settings: any) => <IntlProvider {...settings}>{message}</IntlProvider>;

export default intlHelper;
