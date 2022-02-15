import { useState } from 'react';
import { columnOffset, addSortableTransform } from './helpers';

const useTableSort = (columns, options = {}) => {
  const [sortBy, setSortBy] = useState(
    options.sortBy || {
      index: columnOffset(options),
      direction: 'asc',
    }
  );
  const onSort = (_, index, direction) =>
    setSortBy({
      index,
      direction,
    });

  return {
    sortBy,
    tableProps: {
      onSort,
      sortBy,
      cells: addSortableTransform(columns),
    },
  };
};

export default useTableSort;
