import React, { useState } from 'react';
import { GroupFilter } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { Title } from '@patternfly/react-core';

const items = [
  {
    label: 'Option 1',
    type: 'checkbox',
    value: 1,
  },
  {
    label: 'Option 2',
    type: 'radio',
    value: 2,
  },
  {
    label: 'Option 3',
    type: 'button',
    value: 4,
  },
  {
    // if no type is provided, plain is used. This type is not selectable
    label: 'Option 4',
    value: 5,
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
        <GroupFilter
          selected={selected}
          onChange={(_event, newSelection) => setSelected(newSelection)}
          items={items}
          placeholder="Tree filter demo"
        />
      </div>
    </div>
  );
};

export default SimpleExample;
