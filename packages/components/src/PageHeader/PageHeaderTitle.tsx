import React from 'react';
import classNames from 'classnames';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
import { TitleProps } from '@patternfly/react-core/dist/dynamic/components/Title';
// eslint-disable-next-line rulesdir/forbid-pf-relative-imports
import { useOUIAId } from '@patternfly/react-core';
import { Flex } from '@patternfly/react-core/dist/dynamic/layouts/Flex';
import { FlexItem } from '@patternfly/react-core/dist/dynamic/layouts/Flex';

export interface PageHeaderTitleProps extends Omit<TitleProps, 'title' | 'headingLevel'> {
  title: React.ReactNode;
  actionsContent?: React.ReactNode;
  ouiaId?: string;
  ouiaSafe?: boolean;
}

/**
 * This is the title section of the pageHeader
 */
const PageHeaderTitle: React.FC<PageHeaderTitleProps> = ({ className, title, actionsContent, ouiaId, ouiaSafe = true, ...props }) => {
  const pageHeaderTitleClasses = classNames(className);
  const ouiaComponentType = 'RHI/Header';
  const ouiaFinalId = useOUIAId(ouiaComponentType, ouiaId, ouiaSafe as unknown as string);

  return (
    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
      <FlexItem className="pf-v5-u-flex-grow-1">
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
      </FlexItem>
      {actionsContent ? <FlexItem>{actionsContent}</FlexItem> : null}
    </Flex>
  );
};

export default PageHeaderTitle;
