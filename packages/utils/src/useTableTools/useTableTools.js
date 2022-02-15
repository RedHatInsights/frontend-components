import { useEffect } from 'react';
import { identifyItems } from '../helpers';
import { toToolbarActions } from './helpers';
import { useBulkSelectWithItems } from '../useBulkSelect';
import { useExpandableWithItems } from '../useExpandable';
import { useExportWithItems } from '../useExport';
import { useFilterConfigWithItems } from '../useFilterConfig';
import { usePaginateWithItems } from '../usePaginate';
import { useTableSortWithItems } from '../useTableSort';
import useDedicatedAction from '../useDedicatedAction';
import useColumnManager from '../useColumnManager';
import rowsBuilder from './rowsBuilder';

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

  const { toolbarProps: dedicatedActionToolbarProps } = useDedicatedAction({
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
