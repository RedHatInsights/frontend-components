import React from 'react';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';
import { Title } from '@patternfly/react-core';

const TooltipProps = () => {
  const date = new Date();
  const tooltipProps = {
    position: 'left',
    distance: 80,
  };
  return (
    <div>
      <Title size="lg" headingLevel="h3">
        Tooltip is shown on the left side and is further from the root element.
      </Title>
      <span>Adding tooltip props: &nbsp;</span>
      <DateFormat tooltipProps={tooltipProps} date={date} />
      <br />
    </div>
  );
};

export default TooltipProps;
