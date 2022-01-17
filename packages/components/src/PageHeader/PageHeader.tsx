import React from 'react';
import classNames from 'classnames';

import { DarkContext } from '../Dark';
import './page-header.scss';

export interface PageHeaderProps {
  className?: string;
}

/**
 * This is a page header that mimics the patternfly layout for a header section
 */
const PageHeader: React.FunctionComponent<PageHeaderProps> = ({ className, children, ...props }) => {
  const pageHeaderClasses = classNames(className, 'pf-l-page-header', 'pf-c-page-header', 'pf-l-page__main-section', 'pf-c-page__main-section');

  return (
    <DarkContext.Consumer>
      {(theme = 'light') => {
        const themeClasses = classNames({ [`pf-m-${theme}-200`]: theme === 'dark' }, { [`pf-m-light`]: theme === 'light' });

        return (
          <section {...props} className={`${pageHeaderClasses} ${themeClasses}`} widget-type="InsightsPageHeader">
            {children}
          </section>
        );
      }}
    </DarkContext.Consumer>
  );
};

export default PageHeader;
