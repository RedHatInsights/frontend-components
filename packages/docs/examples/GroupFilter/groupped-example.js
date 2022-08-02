import React, { useState } from 'react';
import ConditionalFilter from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { Title } from '@patternfly/react-core';

const groups = [
  {
    label: 'First group',
    value: 1,
    items: [
      {
        label: 'Option 1',
        type: 'checkbox',
        value: 1,
      },
      {
        label: 'Option 2',
        type: 'checkbox',
        value: 2,
      },
      {
        label: 'Option 3',
        type: 'checkbox',
        value: 4,
      },
    ],
  },
  {
    label: 'Second group',
    type: 'checkbox',
    groupSelectable: true,
    value: 'second',
    items: [
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
    ],
  },
];

const SimpleExample = () => {
  const [selected, setSelected] = useState();
  return (
    <div>
      <Title headingLevel="h3" size="sm">
        Selected values
      </Title>
      <code>{JSON.stringify(selected || [], null, 2)}</code>
      <ConditionalFilter
        items={[
          {
            type: 'group',
            label: 'Group',
            value: 'group-filter',
            filterValues: {
              groups,
              selected,
              onChange: (_event, newSelection) => setSelected(newSelection),
              placeholder: 'Group filter demo',
            },
          },
        ]}
      />
    </div>
  );
};

export default SimpleExample;
