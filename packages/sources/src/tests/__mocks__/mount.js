import React from 'react';
import { IntlProvider } from 'react-intl';
import { mount as mountEnzyme } from 'enzyme';

const mount = (children) => mountEnzyme(<IntlProvider locale="en">
    {children}
</IntlProvider>);

export default mount;
