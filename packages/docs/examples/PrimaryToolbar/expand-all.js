import PrimaryToolbar from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import { useState } from 'react';

const ExpandAll = () => {
  const [filterValue, setFilterValue] = useState('');
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  return (
    <div>
      <PrimaryToolbar
        expandAll={{
          isAllExpanded,
          onClick: () => setIsAllExpanded((prev) => !prev),
        }}
        filterConfig={{ placeholder: 'Filter by string', onChange: ({ target: { value } }) => setFilterValue(value), value: filterValue }}
      />
      <pre className="pf-v5-u-ml-md">{JSON.stringify({ filterValue, isAllExpanded }, null, 2)}</pre>
    </div>
  );
};

export default ExpandAll;
