import PrimaryToolbar from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import { useState } from 'react';

const ToolbarChips = () => {
  const [filterCategory, setFilterCategory] = useState('text-search');
  const [categoryValues, setCategoryValues] = useState({});

  const handleChipDelete = (_e, categories) => {
    setCategoryValues((prev) => {
      const newValues = {
        ...prev,
      };
      categories.forEach(({ name, chips }) => {
        if (name === 'text-search') {
          newValues['text-search'] = '';
        }

        if (name === 'checkbox-search') {
          const chipValue = chips.map(({ name }) => name);
          newValues['checkbox-search'] = newValues['checkbox-search']?.filter((val) => !chipValue.includes(val));
        }
      });

      return newValues;
    });
  };

  const chipsConfig = [];
  if (categoryValues['text-search']?.length > 0) {
    chipsConfig.push({
      category: 'Text search',
      name: 'text-search',
      chips: [
        {
          name: categoryValues['text-search'],
        },
      ],
    });
  }

  if (categoryValues['checkbox-search']?.length > 0) {
    chipsConfig.push({
      category: 'Checkbox search',
      name: 'checkbox-search',
      chips: categoryValues['checkbox-search'].map((name) => ({
        name,
      })),
    });
  }

  return (
    <div>
      <PrimaryToolbar
        activeFiltersConfig={{
          onDelete: handleChipDelete,
          filters: chipsConfig,
        }}
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
      <pre className="pf-u-ml-md">{JSON.stringify({ filterCategory, categoryValues }, null, 2)}</pre>
    </div>
  );
};

export default ToolbarChips;
