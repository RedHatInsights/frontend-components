import React, { useState } from 'react';
import ConditionalFilter from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { Title } from '@patternfly/react-core';

export const textFilterConfig = {
  label: 'name',
  type: 'text', // for text filter this is optional
  value: 'text-filter', // optional identifier when activating filter
  filterValues: {},
  // id: 'some-id', // optional ID
};

const TextFilter = () => {
  const [value, setValue] = useState('');
  return (
    <div>
      <Title headingLevel="h3" size="lg">
        Value
      </Title>
      <code>{JSON.stringify(value || null, null, 2)}</code>
      <ConditionalFilter items={[{ ...textFilterConfig, filterValues: { value, onChange: (_e, val) => setValue(val) } }]} />
    </div>
  );
};

export default TextFilter;
