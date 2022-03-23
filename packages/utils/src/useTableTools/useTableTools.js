import { useEffect } from 'react';
import { identifyItems } from '../helpers';
import { toToolbarActions } from './helpers';
import { useBulkSelectWithItems } from '../useBulkSelect';
import { useExpandableWithItems } from '../useExpandable';
import { useExportWithItems } from '../useExport';
import { useFilterConfigWithItems } from '../useFilterConfig';
import { usePaginateWithItems } from '../usePaginate';
import { useTableSortWithItems } from '../useTableSort';
import useColumnManager from '../useColumnManager';
import { withDedidicatedAction } from '../helpers';
import rowsBuilder from './rowsBuilder';

/**
 * `useTableTools` is a hook combining several hooks to built a PatternFly `Table` with the platform `PrimaryToolbar` component.
 * Each hook can also be used on their own to only leverage a specific functionality.
 *
 * There is also a `TableToolsTable` component that is already setup with a table and invokes the `useTableTools` hook.
 *
 * Both the hook and the component take at least an `items` and `columns` argument/prop.
 *
 * @param {Array} items array of items for the table
 * @param {Array} columns array of (Patternfly) table columns
 * @param {Object} [options]
 */
const useTableTools = (items = [], columns = [], options = {}) => {
  const { toolbarProps: toolbarPropsOption, tableProps: tablePropsOption } = options;

  const identifiedItems = identifyItems(items, options);

  const { columnManagerAction, ColumnManager, columns: managedColumns } = useColumnManager(columns, options);

  const { toolbarProps: toolbarActionsProps } = toToolbarActions({
    ...options,
    actions: [...(options?.actions || []), ...((columnManagerAction && [columnManagerAction]) || [])],
  });

  const { toolbarProps: pagintionToolbarProps, setPage, paginator } = usePaginateWithItems(options);

  const { toolbarProps: conditionalFilterProps, filter, activeFilters } = useFilterConfigWithItems(options);

  const { transformer: openItem, tableProps: expandableProps } = useExpandableWithItems(options);

  const { tableProps: sortableTableProps, sorter, sortBy } = useTableSortWithItems(items, managedColumns, options);

  const {
    transformer: selectItem,
    toolbarProps: bulkSelectToolbarProps,
    tableProps: bulkSelectTableProps,
    selectedItems,
  } = useBulkSelectWithItems({
    ...options,
    items: sorter(identifiedItems),
    filter,
    paginator,
    setPage,
  });

  const { toolbarProps: dedicatedActionToolbarProps } = withDedidicatedAction({
    ...options,
    selected: selectedItems,
  });

  const filteredAndSortedItems = (items, filter, sorter) => {
    const filtered = filter ? filter(items) : items;
    return sorter ? sorter(filtered) : filtered;
  };

  const { toolbarProps: exportToolbarProps } = useExportWithItems(
    filteredAndSortedItems(selectedItems?.length > 0 ? selectedItems : items, filter, sorter),
    managedColumns,
    options
  );

  const { toolbarProps: rowBuilderToolbarProps, tableProps: rowBuilderTableProps } = rowsBuilder(identifiedItems, sortableTableProps.cells, {
    emptyRows: options.emptyRows,
    transformer: [selectItem],
    rowTransformer: [openItem],
    pagination: pagintionToolbarProps?.pagination,
    paginator,
    filter,
    sorter,
  });

  useEffect(() => {
    setPage?.(1);
  }, [JSON.stringify(activeFilters), JSON.stringify(sortBy)]);

  return {
    toolbarProps: {
      ...pagintionToolbarProps,
      ...bulkSelectToolbarProps,
      ...conditionalFilterProps,
      ...dedicatedActionToolbarProps,
      ...rowBuilderToolbarProps,
      ...toolbarPropsOption,
      ...exportToolbarProps,
      ...toolbarActionsProps,
    },
    tableProps: {
      cells: managedColumns,
      ...rowBuilderTableProps,
      ...sortableTableProps,
      ...bulkSelectTableProps,
      ...expandableProps,
      ...tablePropsOption,
    },
    ColumnManager,
  };
};

export default useTableTools;
