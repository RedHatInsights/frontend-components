import React, { useState } from 'react';
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
  const [value, setValue] = useState(1);
  return (
    <div>
      <Title headingLevel="h3" size="lg">
        Selected value
      </Title>
      <code>{JSON.stringify(value || [], null, 2)}</code>
      <ConditionalFilter
        items={[{ ...radioFilterConfig, filterValues: { ...radioFilterConfig.filterValues, value, onChange: (_e, val) => setValue(val) } }]}
      />
    </div>
  );
};

export default RadioFilter;
