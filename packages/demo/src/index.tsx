import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import ConditionalFilter from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { CheckboxFilterValue } from '@redhat-cloud-services/frontend-components/ConditionalFilter/CheckboxFilter';

const MyCmp = () => {
  const [checkboxValues, setCheckboxValues] = useState<CheckboxFilterValue[]>([]);
  const [textFilterValue, setTextFilterValue] = useState('');
  return (
    <ConditionalFilter
      placeholder="Conditional filter"
      items={[
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
