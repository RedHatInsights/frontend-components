import { sortable } from '@patternfly/react-table';
import uniq from 'lodash/uniq';

const isSortable = (column) => column.sortByProp || column.sortByFunction;

export const addSortableTransform = (columns) =>
  columns.map((column) => ({
    ...column,
    ...(isSortable(column)
      ? {
          transforms: uniq([...(column?.transforms || []), sortable]),
        }
      : {}),
  }));

export const columnOffset = (options = {}) => (typeof options.onSelect === 'function') + (typeof options.detailsComponent !== 'undefined');

const getSortable = (property, item) => {
  if (typeof property === 'function') {
    return property(item);
  } else {
    return item[property];
  }
};

export const orderArrayByProp = (property, objects, direction) =>
  objects.sort((a, b) => {
    const compared = String(getSortable(property, a)).localeCompare(String(getSortable(property, b)));
    if (direction === 'asc') {
      return compared;
    }
    return -compared;
  });

export const orderByArray = (objectArray, orderProp, orderArray, direction) => {
  const sortedObjectArray = orderArray.flatMap((orderKey) => objectArray.filter((item) => item[orderProp] === orderKey));
  return direction !== 'asc' ? sortedObjectArray.reverse() : sortedObjectArray;
};
