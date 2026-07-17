/**
 * useTableState Hook
 *
 * Combined state management hook for TableView with optional URL synchronization.
 * Orchestrates smaller focused hooks for pagination, sorting, selection, expansion, and filters.
 *
 * Supports two pagination modes:
 * - 'offset' (default): Standard offset/limit pagination with total count.
 * - 'cursor': Cursor-based pagination for APIs returning CursorPaginationLinks.
 */

import { useCallback, useMemo } from 'react';
import type { UseTableStateOptions, UseTableStateReturn } from '../types';
import { useOptionalSearchParams } from './useOptionalSearchParams';
import { usePaginationState } from './usePaginationState';
import { useCursorPaginationState } from './useCursorPaginationState';
import { useSortState } from './useSortState';
import { useFiltersState } from './useFiltersState';
import { useExpansionState } from './useExpansionState';
import { useRowSelection } from './useRowSelection';
import { useStaleDataEffect } from './useStaleDataEffect';

/**
 * useTableState - Combined state management for TableView
 *
 * This is the main hook consumers should use. It orchestrates smaller hooks
 * for each concern (pagination, sorting, filters, selection, expansion) and
 * provides a unified API.
 *
 * @template TColumns - Const tuple of column IDs
 * @template TRow - Row data type
 * @template TSortable - Union of sortable column IDs
 * @template TCompound - Union of compound expandable column IDs
 */
export function useTableState<
  TColumns extends readonly string[],
  TRow,
  TSortable extends TColumns[number] = never,
  TCompound extends TColumns[number] = never,
>(options: UseTableStateOptions<TColumns, TRow, TSortable, TCompound>): UseTableStateReturn<TColumns, TRow, TSortable, TCompound> {
  const {
    sortableColumns = [] as readonly TSortable[],
    initialSort,
    initialPerPage = 20,
    perPageOptions = [10, 20, 50, 100],
    initialFilters = {},
    initialSelectedRows = [],
    getRowId,
    isRowSelectable = () => true,
    syncWithUrl = false,
    paginationMode = 'offset',
    onStaleData,
    staleDataDebounceMs = 300,
  } = options;

  const isCursorMode = paginationMode === 'cursor';

  // URL search params - safe to use outside Router context
  const { searchParams, setSearchParams, isRouterAvailable } = useOptionalSearchParams();

  // Only sync with URL if explicitly requested AND router is available
  // Note: cursor mode does not support URL sync (cursors are opaque tokens)
  const shouldSyncUrl = syncWithUrl && isRouterAvailable && !isCursorMode;

  // -------------------------------------------------------------------------
  // Pagination State (offset or cursor mode)
  // -------------------------------------------------------------------------
  const offsetPagination = usePaginationState({
    initialPerPage,
    perPageOptions,
    shouldSyncUrl,
    searchParams,
    setSearchParams,
  });

  const cursorPagination = useCursorPaginationState({
    initialPerPage,
    perPageOptions,
  });

  // Select the active pagination based on mode
  const pagination = isCursorMode ? cursorPagination : offsetPagination;

  // -------------------------------------------------------------------------
  // Sort State
  // -------------------------------------------------------------------------
  const { sort, onSortChange: rawOnSortChange } = useSortState({
    sortableColumns,
    initialSort,
    shouldSyncUrl,
    searchParams,
    setSearchParams,
  });

  // Wrap onSortChange to reset pagination when sort changes
  const onSortChange = useCallback(
    (column: TSortable, direction: 'asc' | 'desc') => {
      rawOnSortChange(column, direction);
      pagination.resetPage();
    },
    [rawOnSortChange, pagination.resetPage],
  );

  // -------------------------------------------------------------------------
  // Filters State
  // -------------------------------------------------------------------------
  const { filters, onFiltersChange, clearAllFilters } = useFiltersState({
    initialFilters,
    shouldSyncUrl,
    searchParams,
    setSearchParams,
    onFiltersChanged: pagination.resetPage,
  });

  // -------------------------------------------------------------------------
  // Selection State
  // -------------------------------------------------------------------------
  const { selectedRows, onSelectRow, onSelectAll, clearSelection, isRowSelected } = useRowSelection({
    getRowId,
    isRowSelectable,
    initialSelectedRows,
  });

  // -------------------------------------------------------------------------
  // Expansion State
  // -------------------------------------------------------------------------
  const { expandedCell, onToggleExpand, isCellExpanded, isAnyExpanded } = useExpansionState<TCompound>();

  // -------------------------------------------------------------------------
  // API Params Helper
  // -------------------------------------------------------------------------
  const apiParams = useMemo(() => {
    const offset = isCursorMode ? 0 : (pagination.page - 1) * pagination.perPage;
    let orderBy: `${TSortable}` | `-${TSortable}` | undefined;
    if (sort) {
      orderBy = (sort.direction === 'desc' ? `-${sort.column}` : sort.column) as `${TSortable}` | `-${TSortable}`;
    }

    return {
      offset,
      cursor: isCursorMode ? cursorPagination.cursor : undefined,
      limit: pagination.perPage,
      orderBy,
      filters,
    };
  }, [isCursorMode, pagination.page, pagination.perPage, cursorPagination.cursor, sort, filters]);

  // -------------------------------------------------------------------------
  // Stale Data Notification
  // -------------------------------------------------------------------------
  useStaleDataEffect(apiParams, onStaleData, staleDataDebounceMs);

  // -------------------------------------------------------------------------
  // Return
  // -------------------------------------------------------------------------
  return {
    // Sorting
    sort,
    onSortChange,
    // Pagination
    page: pagination.page,
    perPage: pagination.perPage,
    perPageOptions: pagination.perPageOptions,
    onPageChange: pagination.onPageChange,
    onPerPageChange: pagination.onPerPageChange,
    // Cursor pagination extras (undefined in offset mode)
    hasNextPage: isCursorMode ? cursorPagination.hasNextPage : undefined,
    hasPreviousPage: isCursorMode ? cursorPagination.hasPreviousPage : undefined,
    cursorMeta: isCursorMode
      ? {
          setCursorLinks: cursorPagination.setCursorLinks,
          hasNextPage: cursorPagination.hasNextPage,
          hasPreviousPage: cursorPagination.hasPreviousPage,
        }
      : undefined,
    // Selection
    selectedRows,
    onSelectRow,
    onSelectAll,
    clearSelection,
    // Expansion
    expandedCell,
    onToggleExpand,
    // Filters
    filters,
    onFiltersChange,
    clearAllFilters,
    // Utilities
    isRowSelected,
    isCellExpanded,
    isAnyExpanded,
    // API params
    apiParams,
  };
}
