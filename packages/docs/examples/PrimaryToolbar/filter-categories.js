import PrimaryToolbar from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import { useState } from 'react';

const ToolbarFilterCategories = () => {
  const [filterCategory, setFilterCategory] = useState('text-search');
  const [categoryValues, setCategoryValues] = useState({});
  return (
    <div>
      <PrimaryToolbar
        filterConfig={{
          onChange: (_e, value) => setFilterCategory(value),
          value: filterCategory,
          items: [
            {
              label: 'Text search',
              value: 'text-search',
              filterValues: {
                onChange: (_e, value) => setCategoryValues((prev) => ({ ...prev, [filterCategory]: value })),
                value: categoryValues['text-search'] || '',
              },
            },
            {
              label: 'Checkbox search',
              value: 'checkbox-search',
              type: 'checkbox',
              filterValues: {
                value: categoryValues['checkbox-search'] || [],
                onChange: (_e, values) => setCategoryValues((prev) => ({ ...prev, [filterCategory]: values })),
                items: [
                  {
                    value: 'foo',
                    label: 'Foo',
                  },
                  {
                    value: 'bar',
                    label: 'Bar',
                  },
                ],
              },
            },
          ],
        }}
      />
      <pre className="pf-v5-u-ml-md">{JSON.stringify({ filterCategory, categoryValues }, null, 2)}</pre>
    </div>
  );
};

export default ToolbarFilterCategories;
