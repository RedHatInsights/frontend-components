import React from 'react';
import classNames from 'classnames';

import { DarkContext } from '../Dark';
import './page-header.scss';
import { useOUIAId } from '@patternfly/react-core/dist/dynamic/helpers/OUIA/ouia';

export interface PageHeaderProps {
  className?: string;
  ouiaId?: string;
  ouiaSafe?: boolean;
}

/**
 * This is a page header that mimics the patternfly layout for a header section
 */
const PageHeader: React.FunctionComponent<React.PropsWithChildren<PageHeaderProps>> = ({
  className,
  children,
  ouiaId,
  ouiaSafe = true,
  ...props
}) => {
  const pageHeaderClasses = classNames(
    className,
    'pf-v6-l-page-header',
    'pf-v6-c-page-header',
    'pf-v6-l-page__main-section',
    'pf-v6-c-page__main-section'
  );
  const ouiaComponentType = 'RHI/Header';
  const ouiaFinalId = useOUIAId(ouiaComponentType, ouiaId, ouiaSafe as unknown as string);

  return (
    <DarkContext.Consumer>
      {(theme = 'light') => {
        const themeClasses = classNames({ [`pf-m-${theme}-200`]: theme === 'dark' }, { [`pf-m-light`]: theme === 'light' });

        return (
          <section
            data-ouia-component-type={ouiaComponentType}
            data-ouia-component-id={ouiaFinalId}
            data-ouia-safe={ouiaSafe}
            {...props}
            className={`${pageHeaderClasses} ${themeClasses}`}
            widget-type="InsightsPageHeader"
          >
            {children}
          </section>
        );
      }}
    </DarkContext.Consumer>
  );
};

export default PageHeader;
