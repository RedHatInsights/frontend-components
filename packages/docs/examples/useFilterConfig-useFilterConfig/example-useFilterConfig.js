import React from 'react';
import useFilterConfig from '@redhat-cloud-services/frontend-components-utilities/useFilterConfig';
import PrimaryToolbar from '@redhat-cloud-services/frontend-components/PrimaryToolbar';

const exampleFilters = [
  {
    type: 'text',
    label: 'Name',
  },
  {
    type: 'hidden',
    label: 'Hidden filter',
    filter: (items) => items,
  },
  {
    type: 'checkbox',
    label: 'Checkbox Filter',
    items: ['OPTION 1', 'OPTION 2', 'OPTION 3'].map((option) => ({
      label: option,
      value: `${option}-value`,
    })),
  },
  {
    type: 'radio',
    label: 'Radio Filter',
    items: ['OPTION 1', 'OPTION 2', 'OPTION 3'].map((option) => ({
      label: option,
      value: `${option}-value`,
    })),
  },
  {
    type: 'UNKNOWNTYPE',
    label: 'Invalid Filter',
    items: ['OPTION 1', 'OPTION 2', 'OPTION 3'].map((option) => ({
      label: option,
      value: `${option}-value`,
    })),
  },
  {
    type: 'group',
    label: 'Filter group',
    groupSelectable: true,
    items: [
      {
        label: 'Parent 1',
        value: 1,
        items: [
          { label: 'Child 1', value: 1 },
          { label: 'Child 2', value: 2 },
        ],
      },
      {
        label: 'Parent 2',
        value: 2,
        items: [
          { label: 'Parent 2 Child 1', value: 1 },
          { label: 'Parent 2 Child 2', value: 2 },
        ],
      },
    ],
  },
];

const TableToolsExample = () => {
  const { toolbarProps } = useFilterConfig({
    filters: { filterConfig: exampleFilters },
  });

  return <PrimaryToolbar {...toolbarProps} />;
};

export default TableToolsExample;
