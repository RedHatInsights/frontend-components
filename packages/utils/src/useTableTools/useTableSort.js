import { useState } from 'react';
import { sortable } from '@patternfly/react-table';

const getSortable = (property, item) => {
    if (typeof(property) === 'function') {
        return property(item);
    } else {
        return item[property];
    }
};

const compareSortableAsStrings = (property, a, b) => (
    String(getSortable(property, a))
    .localeCompare(String(getSortable(property, b)))
);

export const orderArrayByProp = (property, objects, direction) => (
    objects.sort((a, b) => {
        if (direction === 'asc') {
            return compareSortableAsStrings(property, a, b);
        } else {
            return -compareSortableAsStrings(property, a, b);
        }
    })
);
export const orderByArray = (objectArray, orderProp, orderArray, direction) => (
    (direction !== 'asc' ? orderArray.reverse() : orderArray).flatMap((orderKey) => (
        objectArray.filter((item) => (item[orderProp] === orderKey))
    ))
);

const isSortable = (column) => (
    column.sortByProp || column.sortByFunction
);

const addSortableTransform = (columns) => (
    columns.map((column) => ({
        ...column,
        ...isSortable(column) ? { transforms: Array.from(new Set([
            ...(column?.transforms || []),
            sortable
        ])) } : {}
    }))
);

const columnOffset = (options = {}) => {
    let offset = 0;

    if (options.selectable) {
        offset += 1;
    }

    if (typeof options.detailsComponent  !== 'undefined') {
        offset += 1;
    }

    return offset;
};

const sorter = (columns, options, sortBy) => (
    (items) => {
        const offset = columnOffset(options);
        const column = columns[sortBy.index - offset];
        const sortedItems = column?.sortByArray ? orderByArray(
            items, column?.sortByProperty, column?.sortByArray, sortBy.direction
        ) : orderArrayByProp(
            (column?.sortByProperty || column?.sortByFunction), items, sortBy.direction
        );

        return sortedItems;
    }
);

const useTableSort = (columns, options = {}) => {
    const [ sortBy, setSortBy ] = useState({
        index: 0,
        direction: 'desc'
    });
    const onSort = (_, index, direction) => {
        setSortBy({
            index,
            direction
        });
    };

    return {
        sorter: sorter(columns, options, sortBy),
        tableProps: {
            onSort,
            sortBy
        },
        columns: addSortableTransform(columns)
    };
};

export default useTableSort;
