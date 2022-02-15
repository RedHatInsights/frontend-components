import { orderArrayByProp, orderByArray, columnOffset } from './helpers';
import useTableSort from './useTableSort';

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
