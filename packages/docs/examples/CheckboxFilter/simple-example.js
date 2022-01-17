import React, { useState } from 'react';
import { CheckboxFilter } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { Title } from '@patternfly/react-core';

const items = [
  {
    label: 'Option 1',
    value: 1,
  },
  {
    label: 'Option 2',
    value: 2,
  },
  {
    label: 'Option 3',
    value: 4,
  },
];

const SimpleExample = () => {
  const [selected, setSelected] = useState();
  return (
    <div>
      <Title headingLevel="h3" size="lg">
        Selected values
      </Title>
      <code>{JSON.stringify(selected || [], null, 2)}</code>
      {/* This is a part of a composite component, use  "ins-c-conditional-filter" className if used as a standalone*/}
      <div className="ins-c-conditional-filter">
        <CheckboxFilter
          value={selected}
          onChange={(_event, newSelection) => setSelected(newSelection)}
          items={items}
          placeholder="Checkbox filter demo"
        />
      </div>
    </div>
  );
};

export default SimpleExample;
