import { useState } from 'react';
import { addSortableTransform, columnOffset } from './helpers';

/**
 * Provides columns with the `sortable` transform mixed in for a Patternfly table.
 *
 * @param {Array} columns Columns for a table
 * @param {Object} [options]
 */
const useTableSort = (columns, options = {}) => {
  const [sortBy, setSortBy] = useState(
    options.sortBy || {
      index: columnOffset(options),
      direction: 'asc',
    }
  );
  const onSort = (_, index, direction) => {
    setSortBy({
      index,
      direction,
    });
    options.onSort?.(index, direction);
  };

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
