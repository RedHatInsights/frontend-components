import React from 'react';
import { IntlProvider } from 'react-intl';
import { mount as mountEnzyme } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

const mount = (children) => mountEnzyme(
    <MemoryRouter initialEntries={[ '/' ]} initialIndex={0} keyLength={0}>
        <IntlProvider locale="en">
            {children}
        </IntlProvider>
    </MemoryRouter>
);

export default mount;
