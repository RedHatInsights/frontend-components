import React from 'react';
import propTypes from 'prop-types';
import { Pagination, PaginationVariant } from '@patternfly/react-core';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import PrimaryToolbar from '../PrimaryToolbar';
import TableToolbar from '../TableToolbar';
import useTableTools from '@redhat-cloud-services/frontend-components-utilities/useTableTools';

const TableToolsTable = ({
  items = [],
  columns = [],
  filters = [],
  options = {},
  toolbarProps: toolbarPropsProp,
  tableHeaderProps,
  tableBodyProps,
  tableToolbarProps,
  paginationProps,
  columnManagerProps,
  ...tablePropsRest
}) => {
  const { toolbarProps, tableProps, ColumnManager } = useTableTools(items, columns, {
    filters,
    toolbarProps: toolbarPropsProp,
    tableProps: tablePropsRest,
    ...options,
  });

  return (
    <React.Fragment>
      <PrimaryToolbar {...toolbarProps} />

      <Table {...tableProps}>
        <TableHeader {...tableHeaderProps} />
        <TableBody {...tableBodyProps} />
      </Table>

      <TableToolbar isFooter {...tableToolbarProps}>
        <Pagination variant={PaginationVariant.bottom} {...toolbarProps.pagination} {...paginationProps} />
      </TableToolbar>

      {ColumnManager && <ColumnManager {...columnManagerProps} />}
    </React.Fragment>
  );
};

TableToolsTable.propTypes = {
  items: propTypes.array.isRequired,
  columns: propTypes.arrayOf(
    propTypes.shape({
      title: propTypes.node,
      transforms: propTypes.array,
      sortByProperty: propTypes.string,
      sortByArray: propTypes.array,
      sortByFunction: propTypes.func,
      renderFunc: propTypes.func,
    })
  ).isRequired,
  filters: propTypes.object,
  options: propTypes.object,
  toolbarProps: propTypes.object,
  tableHeaderProps: propTypes.object,
  tableBodyProps: propTypes.object,
  tableToolbarProps: propTypes.object,
  paginationProps: propTypes.object,
  columnManagerProps: propTypes.object,
};

export default TableToolsTable;
