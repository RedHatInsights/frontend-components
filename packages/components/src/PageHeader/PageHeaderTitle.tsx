import React from 'react';
import classNames from 'classnames';
import { 
  Title, 
  TitleProps, 
  Flex, 
  FlexItem  
} from '@patternfly/react-core';


export interface PageHeaderTitleProps extends Omit<TitleProps, 'title' | 'headingLevel'> {
  title: React.ReactNode;
  actionsComponent: React.ReactNode;
}

/**
 * This is the title section of the pageHeader
 */
const PageHeaderTitle: React.FunctionComponent<PageHeaderTitleProps> = ({ className, title, actionsComponent }) => {
  const pageHeaderTitleClasses = classNames(className);

  return (
   <Flex className="example-border" justifyContent={{ default: 'justifyContentSpaceBetween' }}>
    <FlexItem>    
      <Title headingLevel="h1" size="2xl" className={pageHeaderTitleClasses} widget-type="InsightsPageHeaderTitle">
        {title}
      </Title>
    </FlexItem>
    {actionsComponent && <FlexItem>{actionsComponent}</FlexItem>}
  </Flex>
  );
};

export default PageHeaderTitle;
