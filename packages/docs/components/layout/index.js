import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Page, PageHeader, PageSidebar, PageSection, Split, SplitItem, Stack, StackItem, Flex, FlexItem } from '@patternfly/react-core';
import { createUseStyles } from 'react-jss';
import classnames from 'classnames';
import Link from 'next/link';
import HeaderTools from './header-tools';
import useNavigation from './use-navigation';
import navigationMapper from '../navigation/navigation-mapper';
import Breadcrumbs from './breadcrumbs';
import TableOfContents from '../table-of-contents';
import Navigation from '../navigation/common-navigation';

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
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 'calc(100% - 16px * 2)',
  },
  tableOfContents: {
    display: 'none',
  },
  '@media (min-width: 1200px)': {
    content: {
      width: 900,
    },
    tableOfContents: {
      display: 'block',
    },
  },
  link: {
    textDecoration: 'none',
    color: 'var(--pf-global--BackgroundColor--100)',
  },
  footer: {
    height: 'auto',
    background: 'var(--pf-global--BackgroundColor--dark-100)',
  },
});

const Footer = (props) => <footer {...props}></footer>;

const footerItems = [
  { title: 'console.redhat.com', href: 'https://console.redhat.com/' },
  { title: 'Consoledot Platform Documentation', href: 'https://consoledot.pages.redhat.com/docs/dev/index.html' },
  { title: 'PatternFly', href: 'https://www.patternfly.org/v4/' },
  { title: 'GitHub', href: 'https://github.com/RedHatInsights/frontend-components' },
];

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
        <Split style={{ minHeight: '76.9vh' }} hasGutter>
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

      <PageSection className={classes.footer} isFilled={false}>
        <Footer className="pf-u-my-xl pf-u-mx-md">
          <Flex
            direction={{ default: 'column', md: 'row' }}
            justifyContent={{ md: 'justifyContentFlexEnd' }}
            alignContent={{ default: 'alignContentCenter' }}
          >
            <Flex
              alignSelf={{ default: 'alignSelfStretch' }}
              alignItems={{ default: 'alignItemsCenter' }}
              justifyContent={{ default: 'justifyContentCenter' }}
            >
              <FlexItem style={{ display: 'flex' }}>
                <Link href="/">
                  <a>
                    <img className={classes.logo} src="/logo.svg" alt="logo" />
                  </a>
                </Link>
              </FlexItem>
            </Flex>
            <Flex direction={{ default: 'column', md: 'row' }} alignItems={{ default: 'alignItemsCenter' }}>
              {footerItems.map(({ href, title }) => (
                <FlexItem key={title}>
                  <Link href={href}>
                    <a className={classes.link}>{title}</a>
                  </Link>
                </FlexItem>
              ))}
            </Flex>
          </Flex>
        </Footer>
      </PageSection>
    </Page>
  );
};

Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
};

export default Layout;
