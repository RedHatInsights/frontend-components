import PrimaryToolbar from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import { useState } from 'react';

const SimpleToolbar = () => {
  const [filterValue, setFilterValue] = useState('');
  return (
    <div>
      <PrimaryToolbar
        filterConfig={{ placeholder: 'Filter by string', onChange: ({ target: { value } }) => setFilterValue(value), value: filterValue }}
      />
      <pre className="pf-u-ml-md">{JSON.stringify({ filterValue })}</pre>
    </div>
  );
};

export default SimpleToolbar;
