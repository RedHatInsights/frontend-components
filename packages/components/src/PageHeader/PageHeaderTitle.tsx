import React from 'react';
import classNames from 'classnames';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
import { TitleProps } from '@patternfly/react-core/dist/dynamic/components/Title';
import { Flex } from '@patternfly/react-core/dist/dynamic/layouts/Flex';
import { FlexItem } from '@patternfly/react-core/dist/dynamic/layouts/Flex';

export interface PageHeaderTitleProps extends Omit<TitleProps, 'title' | 'headingLevel'> {
  title: React.ReactNode;
  actionsContent?: React.ReactNode;
}

/**
 * This is the title section of the pageHeader
 */
const PageHeaderTitle: React.FC<PageHeaderTitleProps> = ({ className, title, actionsContent }) => {
  const pageHeaderTitleClasses = classNames(className);

  return (
    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
      <FlexItem>
        <Title headingLevel="h1" size="2xl" className={pageHeaderTitleClasses} widget-type="InsightsPageHeaderTitle">
          {title}
        </Title>
      </FlexItem>
      {actionsContent ? <FlexItem>{actionsContent}</FlexItem> : null}
    </Flex>
  );
};

export default PageHeaderTitle;
