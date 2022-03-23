import React, { useState } from 'react';
import get from 'lodash/get';
import ColumnManager from '@redhat-cloud-services/frontend-components/ColumnManager';
import { filterColumnsBySelected, filterManageableColumns } from './helper';

/**
 * Provides columns for a Patternfly table, a (Primary)Toolbar action and a `ColumnManager` component
 *
 * @param {Array} columns Columns for a table to be managed
 * @param {Object} [options] function to call when a selection is made
 */
const useColumnManager = (columns = [], options = {}) => {
  const { columnManagerSelectProp: selectProp = 'key', manageColumns: enableColumnManager, manageColumnLabel = 'Manage columns' } = options;
  const managableColumns = filterManageableColumns(columns, selectProp);
  const [selectedColumns, setSelectedColumns] = useState(managableColumns.map((column) => get(column, selectProp)));
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  const onClick = () => {
    setIsManagerOpen(true);
  };

  const onSave = (newSelectedColumns) => {
    setSelectedColumns(newSelectedColumns);
    setIsManagerOpen(false);
  };

  return managableColumns?.length !== 0
    ? {
        columns: filterColumnsBySelected(managableColumns, selectedColumns, selectProp),
        columnManagerAction: {
          label: manageColumnLabel,
          onClick,
        },
        // eslint-disable-next-line react/display-name
        ColumnManager: () => (
          <ColumnManager
            columns={managableColumns}
            isOpen={isManagerOpen}
            onClose={() => setIsManagerOpen(false)}
            selectedColumns={selectedColumns}
            onSave={onSave}
            selectProp={selectProp}
          />
        ),
      }
    : { columns };
};

export default useColumnManager;
