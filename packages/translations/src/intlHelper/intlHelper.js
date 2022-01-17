import React from 'react';
import IntlProvider from '../Provider';

const intlHelper = (message, settings) => <IntlProvider {...settings}>{message}</IntlProvider>;

export default intlHelper;
