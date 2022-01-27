import React from 'react';
import classNames from 'classnames';
import { Title, TitleProps } from '@patternfly/react-core';

export interface PageHeaderTitleProps extends Omit<TitleProps, 'title' | 'headingLevel'> {
  title: React.ReactNode;
}

/**
 * This is the title section of the pageHeader
 */
const PageHeaderTitle: React.FunctionComponent<PageHeaderTitleProps> = ({ className, title }) => {
  const pageHeaderTitleClasses = classNames(className);

  return (
    <Title headingLevel="h1" size="2xl" className={pageHeaderTitleClasses} widget-type="InsightsPageHeaderTitle">
      {title}
    </Title>
  );
};

export default PageHeaderTitle;
