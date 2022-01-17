import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Page, PageHeader, PageSidebar, Split, SplitItem, Stack, StackItem } from '@patternfly/react-core';
import { createUseStyles } from 'react-jss';
import classnames from 'classnames';
import Link from 'next/link';
import HeaderTools from './header-tools';
import useNavigation from './use-navigation';
import navigationMapper from '../navigation/navigation-mapper';
import Breadcrumbs from './breadcrumbs';
import TableOfContents from '../table-of-contents';

const useStyles = createUseStyles({
  page: {
    height: '100vh !important',
  },
  logo: {
    width: 100,
  },
  platExGuy: {
    maxHeight: '100%',
  },
  content: {
    marginLeft: 'initial',
    marginRight: 'initial',
    width: 'calc(100% - 16px * 2)',
  },
  tableOfContents: {
    display: 'none',
  },
  '@media (min-width: 1200px)': {
    content: {
      width: 900,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    tableOfContents: {
      display: 'block',
    },
  },
});

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const navId = useNavigation();
  const classes = useStyles();
  const NavComponent = navigationMapper[navId];
  const Header = (
    <PageHeader
      logo={
        <Link href="/">
          <img className={classes.logo} src="/logo.svg" alt="logo" />
        </Link>
      }
      headerTools={<HeaderTools />}
      showNavToggle={!!NavComponent}
      isNavOpen={isOpen}
      onNavToggle={() => setIsOpen((prev) => !prev)}
    />
  );
  const Sidebar = <PageSidebar nav={NavComponent && <NavComponent />} isNavOpen={isOpen} />;
  return (
    <Page className={classes.page} header={Header} sidebar={NavComponent && Sidebar}>
      <Split hasGutter>
        <SplitItem isFilled>
          <div className={classnames('pf-u-p-md', classes.content)}>
            <Stack hasGutter>
              <StackItem>
                <Breadcrumbs />
              </StackItem>
              <StackItem id="docs-content">{children}</StackItem>
            </Stack>
          </div>
        </SplitItem>
        <SplitItem className={classes.tableOfContents}>
          <TableOfContents />
        </SplitItem>
      </Split>
    </Page>
  );
};

Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
};

export default Layout;
