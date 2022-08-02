import { columnOffset, orderArrayByProp, orderByArray } from './helpers';
import useTableSort from './useTableSort';

/**
 * Provides columns with the `sortable` transform mixed in for a Patternfly table with items to be sorted.
 *
 * `columns` can provide "sort by" props to use for sorting:
 *
 * ### Additional column properties
 *  * **sortByProperty** - set the property by which the items should be sorted by
 *  * **sortByFunction** - allows to provide a function returning a comparable value
 *  * **sortByArray** - allows to provide an array by which the items should be sorted by
 *
 * @param {Array} columns Columns for a table
 * @param {Object} [options]
 */
const useTableSortWithItems = (items, columns, options) => {
  const { tableProps, sortBy } = useTableSort(columns, options);
  const currentSortableColumn = columns[sortBy.index - columnOffset(options)];

  const sorter = (items) =>
    currentSortableColumn?.sortByArray
      ? orderByArray(items, currentSortableColumn?.sortByProp, currentSortableColumn?.sortByArray, sortBy.direction)
      : orderArrayByProp(currentSortableColumn?.sortByProp || currentSortableColumn?.sortByFunction, items, sortBy.direction);

  return {
    sortBy,
    tableProps: {
      ...tableProps,
      sortBy: items.length > 0 ? sortBy : undefined,
    },
    sorter,
  };
};

export default useTableSortWithItems;
