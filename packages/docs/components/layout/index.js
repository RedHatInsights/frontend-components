import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Page, PageHeader, PageSidebar, PageSection, PageSectionVariants, Split, SplitItem, Stack, StackItem } from '@patternfly/react-core';
import { createUseStyles } from 'react-jss';
import classnames from 'classnames';
import Link from 'next/link';
import HeaderTools from './header-tools';
import useNavigation from './use-navigation';
import navigationMapper from '../navigation/navigation-mapper';
import Breadcrumbs from './breadcrumbs';
import TableOfContents from '../table-of-contents';
import Navigation from '../navigation/common-navigation';
import { Footer } from '../../pages';

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
  footer: {
    height: 100,
  },
});

function useNavigationElement(navId) {
  const [NavComponent, setNavComponent] = useState(undefined);
  useEffect(() => {
    if (navId === '') {
      setNavComponent(undefined);
    } else {
      let NavComponent = navigationMapper[navId];
      if (!NavComponent) {
        try {
          const data = require(`../navigation/${navId}-navigation.json`);
          NavComponent = () =>
            function CommonNav() {
              return <Navigation {...data} />;
            };
          setNavComponent(NavComponent);
        } catch (err) {
          console.log('Could not retrieve navigation data for: ', navId);
          NavComponent = undefined;
        }
      } else {
        setNavComponent(() => NavComponent);
      }
    }
  }, [navId]);

  return NavComponent;
}

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const navId = useNavigation();
  const classes = useStyles();
  const NavComponent = useNavigationElement(navId);
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
  const Sidebar = <PageSidebar nav={navId?.length > 0 && NavComponent && <NavComponent />} isNavOpen={isOpen} />;
  return (
    <Page className={classes.page} header={Header} sidebar={NavComponent && Sidebar}>
      <div>
        <Split style={{ minHeight: '81vh' }} hasGutter>
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
      </div>

      <PageSection className={classes.footer} variant={PageSectionVariants.light} isFilled={false}>
        <Footer>
          <Link href="https://console.redhat.com/">
            <a>console.redhat.com</a>
          </Link>
        </Footer>
      </PageSection>
    </Page>
  );
};

Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
};

export default Layout;
