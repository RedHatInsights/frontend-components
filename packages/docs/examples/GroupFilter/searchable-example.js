import React, { useState } from 'react';
import ConditionalFilter from '@redhat-cloud-services/frontend-components/ConditionalFilter';
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

const SearchableExample = () => {
  const [value, setValue] = useState({});
  const [filterBy, setFilterBy] = useState('');
  return (
    <div>
      <Title headingLevel="h3" size="lg">
        Selected values
      </Title>
      <code>{JSON.stringify(value || [], null, 2)}</code>
      <ConditionalFilter
        items={[
          {
            type: 'group',
            label: 'Group',
            value: 'group-filter',
            filterValues: {
              selected: value,
              onChange: (_event, newSelection) => setValue(newSelection),
              placeholder: 'Group filter demo',
              items: items.filter(({ label }) => !filterBy || label.includes(filterBy)),
              isFilterable: true,
              filterBy,
              onFilter: (filterBy) => setFilterBy(filterBy),
            },
          },
        ]}
      />
    </div>
  );
};

export default SearchableExample;
