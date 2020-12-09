import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Page,
    PageHeader,
    PageSidebar
} from '@patternfly/react-core';
import { createUseStyles } from 'react-jss';
import Link from 'next/link';
import Navigation from '../navigation';
import HeaderTools from './header-tools';

const useStyles = createUseStyles({
    page: {
        height: '100vh !important'
    },
    logo: {
        width: 100
    }
});

const Layout = ({ children }) => {
    const [ isOpen, setIsOpen ] = useState(true);
    const classes = useStyles();
    const Header = (
        <PageHeader
            logo={
                <Link href="/">
                    <img className={classes.logo} src="/logo.svg" alt="logo"/>
                </Link>
            }
            headerTools={<HeaderTools />}
            showNavToggle
            isNavOpen={isOpen}
            onNavToggle={() => setIsOpen(prev => !prev)}
        />
    );
    const Sidebar = <PageSidebar nav={<Navigation />} isNavOpen={isOpen} />;
    return (
        <Page className={classes.page} header={Header} sidebar={Sidebar}>
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
