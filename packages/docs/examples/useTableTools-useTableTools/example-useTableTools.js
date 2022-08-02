import React, { Fragment } from 'react';
import useTableTools from '@redhat-cloud-services/frontend-components-utilities/useTableTools';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import PrimaryToolbar from '@redhat-cloud-services/frontend-components/PrimaryToolbar';

const TableToolsExample = () => {
  const items = [
    {
      id: 1,
      name: 'Item #1',
    },
    {
      id: 2,
      name: 'Item #2',
    },
    {
      id: 3,
      name: 'Item #3',
    },
  ];
  const columns = [
    {
      title: 'Name',
      key: 'name',
    },
  ];
  const filters = {
    filterConfig: [
      {
        type: 'text',
        label: 'Name',
        filter: (items, value) => items.filter((item) => item?.name.includes(value)),
      },
    ],
  };
  const { toolbarProps, tableProps } = useTableTools(items, columns, { filters });

  return (
    <Fragment>
      <PrimaryToolbar {...toolbarProps} />

      <Table {...tableProps}>
        <TableHeader />
        <TableBody />
      </Table>
    </Fragment>
  );
};

export default TableToolsExample;
