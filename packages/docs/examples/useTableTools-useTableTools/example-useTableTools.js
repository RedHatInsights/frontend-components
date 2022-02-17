import React from 'react';
// import useTableTools from '@redhat-cloud-services/frontend-components-utilities/useTableTools';
// import { Table } from '@patternfly/react-table';
// import PrimaryToolbar from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
const Table = () => '';
const PrimaryToolbar = () => '';
const useTableTools = () => ({ toolbarProps: {}, tableProps: {} });

const TableToolsExample = () => {
  const items = [
    {
      name: 'Item #1',
    },
  ];
  const columns = [
    {
      title: 'Name',
      key: 'name',
      renderFunc: (name) => name,
    },
  ];
  const { toolbarProps, tableProps } = useTableTools(items, columns);

  return (
    <>
      <PrimaryToolbar {...toolbarProps} />

      <Table {...tableProps} />
    </>
  );
};

export default TableToolsExample;
