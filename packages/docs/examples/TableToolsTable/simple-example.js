import React from 'react';
import TableToolsTable from '@redhat-cloud-services/frontend-components/TableToolsTable';

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

  return <TableToolsTable items={items} columns={columns} filters={filters} />;
};

export default TableToolsExample;
