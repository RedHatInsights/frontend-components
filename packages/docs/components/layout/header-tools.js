import React, { useState, Fragment } from 'react';
import { ApplicationLauncher, ApplicationLauncherItem, PageHeaderTools } from '@patternfly/react-core';
import { createUseStyles } from 'react-jss';
import SearchInput from '../search/search-input';
import sections from '../sections/sections-definition';
import Link from 'next/link';
import { useRouter } from 'next/router';

const useStyles = createUseStyles({
  search: {
    maxWidth: 400,
    margin: 'auto',
    '& .pf-c-search-input__icon': {
      color: 'var(--pf-global--palette--black-600) !important',
    },
  },
});

const HeaderTools = () => {
  const [isLauncherOpen, setLanucherOpen] = useState(false);
  const { pathname } = useRouter();
  const classes = useStyles();

  return (
    <Fragment>
      {pathname !== '/' && <SearchInput className={classes.search} />}
      <PageHeaderTools>
        <ApplicationLauncher
          position="right"
          onSelect={() => setLanucherOpen(false)}
          onToggle={() => setLanucherOpen((prev) => !prev)}
          isOpen={isLauncherOpen}
          items={sections.map(({ title, href }) => (
            <ApplicationLauncherItem
              key={title}
              component={
                <Link href={href || '#'}>
                  <a className="pf-c-app-launcher__menu-item" href={href || '#'}>
                    {title}
                  </a>
                </Link>
              }
            />
          ))}
        />
        <a href="https://github.com/RedHatInsights/frontend-components" rel="noopener noreferrer" target="_blank">
          <img src="/github-logo.svg" alt="Github logo" />
        </a>
      </PageHeaderTools>
    </Fragment>
  );
};

export default HeaderTools;
