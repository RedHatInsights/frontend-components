import PrimaryToolbar from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import { useState } from 'react';

const WithBulkSelect = () => {
  const [filterValue, setFilterValue] = useState('');
  const [bulkSelectChecked, setBulkSelectChecked] = useState(false);
  return (
    <div>
      <PrimaryToolbar
        bulkSelect={{
          count: 33,
          label: 'Select all',
          checked: bulkSelectChecked,
          onSelect: () => setBulkSelectChecked((prev) => !prev),
        }}
        filterConfig={{ placeholder: 'Filter by string', onChange: ({ target: { value } }) => setFilterValue(value), value: filterValue }}
      />
      <pre className="pf-u-ml-md">{JSON.stringify({ filterValue, bulkSelectChecked }, null, 2)}</pre>
    </div>
  );
};

export default WithBulkSelect;
