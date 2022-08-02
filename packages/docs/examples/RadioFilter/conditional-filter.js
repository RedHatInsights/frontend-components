import React from 'react';
import ConditionalFilter from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { Title } from '@patternfly/react-core';

export const radioFilterConfig = {
  label: 'name',
  type: 'radio',
  value: 'radio-filter', // optional identifier when activating filter
  filterValues: {
    // If no items are passed the component defaults to text input
    items: [
      {
        label: <div>Some value</div>, // value can be React.node
        value: 1,
      },
      {
        label: 'Other',
        value: 2,
      },
    ],
  },
  // id: 'some-id', // optional ID
};

const RadioFilter = () => {
  return (
    <div>
      <Title headingLevel="h3" size="lg">
        Selection is controlled by ConditionalFilter itself!
      </Title>
      <ConditionalFilter items={[radioFilterConfig]} />
    </div>
  );
};

export default RadioFilter;
