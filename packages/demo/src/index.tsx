import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import ConditionalFilter, { GroupFilterItem, GroupType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { CheckboxFilterValue } from '@redhat-cloud-services/frontend-components/ConditionalFilter/CheckboxFilter';
import { Group, GroupItem } from '@redhat-cloud-services/frontend-components/ConditionalFilter/GroupFilter';

const MyCmp = () => {
  const [checkboxValues, setCheckboxValues] = useState<CheckboxFilterValue[]>([]);
  const [textFilterValue, setTextFilterValue] = useState('');
  const [groupFilterInputValue, setGroupFilterInputValue] = useState('');
  const [groupFilterValue, setGroupFilterValue] = useState<Record<string, Record<string, GroupItem | boolean>>>({});

  const groupFilterItems: GroupFilterItem[] = [
    {
      value: 'treeview',
      type: GroupType.treeView,
      name: 'first-tree',
      label: 'Tree view label',
      children: [
        {
          label: 'Child number one',
          value: 'child-number-one',
          type: GroupType.checkbox,
        },
        {
          label: 'Child number two',
          value: 'child-number-two',
          type: GroupType.checkbox,
        },
        {
          label: 'Child number three',
          value: 'child-number-three',
          type: GroupType.radio,
        },
      ],
    },
    {
      label: 'Checkbox one',
      value: 'checkbox-one',
      type: GroupType.checkbox,
    },
    {
      label: 'Checkbox two',
      value: 'checkbox-two',
      type: GroupType.checkbox,
    },
    {
      label: 'Item one',
      value: 'value one',
    },
    {
      label: 'Radio one',
      value: 'radio-one',
      type: GroupType.radio,
    },
    {
      label: 'Radio two',
      value: 'radio-two',
      type: GroupType.radio,
    },
  ];

  const conditionalFilterGroups: Group[] = [
    {
      label: 'First group',
      id: 'group-one',
      items: [
        {
          type: GroupType.checkbox,
          label: 'Group checkbox',
          value: 'group-value-one',
        },
        {
          type: GroupType.checkbox,
          label: 'Group checkbox two',
          value: 'group-value-two',
        },
      ],
    },
  ];
  return (
    <ConditionalFilter
      placeholder="Conditional filter"
      items={[
        {
          type: 'group',
          label: 'Group filter type',
          filterValues: {
            isFilterable: true,
            selected: groupFilterValue,
            onFilter: setGroupFilterInputValue,
            onChange: (_e, selected, selectedItem) => {
              console.log({ selected, selectedItem });
              setGroupFilterValue(selected);
            },
            groups: conditionalFilterGroups,
            items: groupFilterInputValue
              ? groupFilterItems.filter(
                  ({ value, label }) => value.includes(groupFilterInputValue) || (typeof label === 'string' && label.includes(groupFilterInputValue))
                )
              : groupFilterItems,
          },
        },
        {
          type: 'checkbox',
          label: 'Checkbox filter type',
          filterValues: {
            onChange: (_e, values) => setCheckboxValues(values),
            value: checkboxValues,
            placeholder: 'Pick something',
            items: [
              {
                label: 'foo',
                value: 'foo',
              },
              {
                label: 'bar',
                value: 'bar',
              },
            ],
          },
        },
        {
          type: 'text',
          label: 'text filter type',
          filterValues: {
            value: textFilterValue,
            onChange: (_e, value = '') => setTextFilterValue(value),
          },
        },
      ]}
    />
  );
};

const element = document.querySelector('.demo-app');
if (element) {
  const root = createRoot(element);
  root.render(<MyCmp />);
}
