/**
 * useSortState Hook
 *
 * Manages sort state with optional URL synchronization.
 */

import { useCallback, useState } from 'react';
import type { SortDirection, SortState } from '../types';
import { getSortFromUrl, updateSortInUrl } from './tableUrlState';

type SetSearchParams = (fn: (prev: URLSearchParams) => URLSearchParams) => void;

export interface UseSortStateOptions<TSortable extends string> {
  /** Sortable column IDs */
  sortableColumns: readonly TSortable[];
  /** Initial sort state */
  initialSort?: SortState<TSortable>;
  /** Whether to sync with URL */
  shouldSyncUrl: boolean;
  /** Current search params (for initial state) */
  searchParams: URLSearchParams;
  /** Function to update search params */
  setSearchParams: SetSearchParams;
}

export interface UseSortStateReturn<TSortable extends string> {
  /** Current sort state */
  sort: SortState<TSortable> | null;
  /** Change sort column and direction */
  onSortChange: (column: TSortable, direction: SortDirection) => void;
}

/**
 * Hook for managing sort state with optional URL sync.
 */
export function useSortState<TSortable extends string>({
  sortableColumns,
  initialSort,
  shouldSyncUrl,
  searchParams,
  setSearchParams,
}: UseSortStateOptions<TSortable>): UseSortStateReturn<TSortable> {
  const [sort, setSortState] = useState<SortState<TSortable> | null>(() =>
    shouldSyncUrl ? getSortFromUrl(searchParams, sortableColumns, initialSort) : initialSort || null,
  );

  const onSortChange = useCallback(
    (column: TSortable, direction: SortDirection) => {
      setSortState({ column, direction });
      if (shouldSyncUrl) {
        setSearchParams((prev) => updateSortInUrl(prev, column, direction));
      }
    },
    [shouldSyncUrl, setSearchParams],
  );

  return {
    sort,
    onSortChange,
  };
}
