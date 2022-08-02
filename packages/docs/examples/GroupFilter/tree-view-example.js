import React, { useState } from 'react';
import ConditionalFilter from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { Title } from '@patternfly/react-core';

const groups = [
  {
    value: 11,
    type: 'treeView',
    label: 'Some',
    items: [
      {
        value: 1,
        label: 'First',
        children: [
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
      {
        value: 22,
        label: 'Shallow',
      },
    ],
  },
];

const TreeViewExample = () => {
  const [selected, setSelected] = useState();
  return (
    <div>
      <Title headingLevel="h3" size="lg">
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

export default TreeViewExample;
