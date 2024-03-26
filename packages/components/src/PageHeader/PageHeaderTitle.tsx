import React from 'react';
import classNames from 'classnames';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
import { TitleProps } from '@patternfly/react-core/dist/dynamic/components/Title';
import { useOUIAId } from '@patternfly/react-core';

export interface PageHeaderTitleProps extends Omit<TitleProps, 'title' | 'headingLevel'> {
  title: React.ReactNode;
  ouiaId?: string;
  ouiaSafe?: boolean;
}

/**
 * This is the title section of the pageHeader
 */
const PageHeaderTitle: React.FunctionComponent<PageHeaderTitleProps> = ({ className, title, ouiaId, ouiaSafe = true, ...props }) => {
  const pageHeaderTitleClasses = classNames(className);
  const ouiaComponentType = 'RHI/Header';
  const ouiaFinalId = useOUIAId(ouiaComponentType, ouiaId, ouiaSafe as unknown as string);

  return (
    <Title
      headingLevel="h1"
      size="2xl"
      className={pageHeaderTitleClasses}
      widget-type="InsightsPageHeaderTitle"
      data-ouia-component-type={ouiaComponentType}
      data-ouia-component-id={ouiaFinalId}
      data-ouia-safe={ouiaSafe}
      {...props}
    >
      {title}
    </Title>
  );
};

export default PageHeaderTitle;
