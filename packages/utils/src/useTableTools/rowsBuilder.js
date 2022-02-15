import React from 'react';
import { NoResultsTable } from '@redhat-cloud-services/frontend-components/TableToolsTable/NoResultsTable';

const emptyRows = [
  {
    cells: [
      {
        title: () => <NoResultsTable />, // eslint-disable-line react/display-name
        props: {
          colSpan: 3,
        },
      },
    ],
  },
];

const columnProp = (column) => column.key || column.original?.toLowerCase() || column.title?.toLowerCase();

const itemRow = (item, columns) => ({
  ...item.rowProps,
  itemId: item.itemId,
  cells: columns.map((column) => ({
    title: column.renderFunc ? column.renderFunc(undefined, undefined, item) : item[columnProp(column)],
  })),
});

const primeItem = (item, transformers) => {
  let newItem = item;

  transformers.forEach((transformer) => {
    if (transformer) {
      newItem = transformer(newItem);
    }
  });

  return newItem;
};

const applyTransformers = (items, transformers = []) => items.map((item) => primeItem(item, transformers));

const buildRow = (item, columns, rowTransformer, idx) =>
  rowTransformer.flatMap((transformer) => {
    const row = itemRow(item, columns);
    return transformer ? transformer(row, item, columns, idx) : row;
  });

const rowsBuilder = (items, columns, options = {}) => {
  const { transformer = [], rowTransformer = [] } = options;
  const EmptyRowsComponent = options.emptyRows || emptyRows;
  const transformedItems = transformer ? applyTransformers(items, transformer) : items;

  const filteredItems = options?.filter ? options.filter(transformedItems) : transformedItems;

  const sortedItems = options?.sorter ? options.sorter(filteredItems) : filteredItems;

  const paginatedItems = options?.paginator ? options?.paginator(sortedItems) : sortedItems;

  const rows =
    paginatedItems.length > 0
      ? paginatedItems.flatMap((item, idx) => buildRow(item, columns, rowTransformer, idx)).filter((v) => !!v)
      : EmptyRowsComponent;

  const pagination = options?.pagination
    ? {
        ...options.pagination,
        itemCount: filteredItems.length,
      }
    : undefined;

  return {
    tableProps: {
      rows,
    },
    toolbarProps: {
      pagination,
    },
  };
};

export default rowsBuilder;
