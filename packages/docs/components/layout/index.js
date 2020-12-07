import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Page,
    PageHeader,
    PageHeaderTools,
    PageSidebar
} from '@patternfly/react-core';
import Navigation from '../navigation';

const Layout = ({ children }) => {
    const [ isOpen, setIsOpen ] = useState(true);
    const logoProps = {
        href: 'https://patternfly.org',
        onClick: () => console.log('clicked logo'),
        target: '_blank'
    };
    const Header = (
        <PageHeader
            logo="Logo"
            logoProps={logoProps}
            headerTools={<PageHeaderTools>header-tools</PageHeaderTools>}
            showNavToggle
            isNavOpen={isOpen}
            onNavToggle={() => setIsOpen(prev => !prev)}
        />
    );
    const Sidebar = <PageSidebar nav={<Navigation />} isNavOpen={isOpen} />;
    return (
        <Page header={Header} sidebar={Sidebar}>
            <div className="pf-u-p-md">
                {children}
            </div>
        </Page>
    );
};

Layout.propTypes = {
    children: PropTypes.oneOfType([ PropTypes.node, PropTypes.arrayOf(PropTypes.node) ])
};

export default Layout;
