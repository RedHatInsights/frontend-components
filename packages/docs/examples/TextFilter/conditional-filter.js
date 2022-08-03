import React from 'react';
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
  return (
    <div>
      <Title headingLevel="h3" size="lg">
        Value is controlled by ConditionalFilter itself!
      </Title>
      <ConditionalFilter items={[textFilterConfig]} />
    </div>
  );
};

export default TextFilter;
