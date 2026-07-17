/**
 * usePaginationState Hook
 *
 * Manages pagination state with optional URL synchronization.
 */

import { useCallback, useState } from 'react';
import { getPageFromUrl, getPerPageFromUrl, updatePageInUrl, updatePerPageInUrl } from './tableUrlState';

type SetSearchParams = (fn: (prev: URLSearchParams) => URLSearchParams) => void;

export interface UsePaginationStateOptions {
  /** Initial items per page */
  initialPerPage: number;
  /** Available per-page options */
  perPageOptions: number[];
  /** Whether to sync with URL */
  shouldSyncUrl: boolean;
  /** Current search params (for initial state) */
  searchParams: URLSearchParams;
  /** Function to update search params */
  setSearchParams: SetSearchParams;
}

export interface UsePaginationStateReturn {
  /** Current page (1-indexed) */
  page: number;
  /** Items per page */
  perPage: number;
  /** Available per-page options */
  perPageOptions: number[];
  /** Change current page */
  onPageChange: (page: number) => void;
  /** Change items per page (resets to page 1) */
  onPerPageChange: (perPage: number) => void;
  /** Reset page to 1 (used when filters change) */
  resetPage: () => void;
}

/**
 * Hook for managing pagination state with optional URL sync.
 */
export function usePaginationState({
  initialPerPage,
  perPageOptions,
  shouldSyncUrl,
  searchParams,
  setSearchParams,
}: UsePaginationStateOptions): UsePaginationStateReturn {
  // Minimum valid perPage is the smallest perPageOption (typically 10)
  const minPerPage = perPageOptions[0] ?? 10;

  const [page, setPageState] = useState(() => {
    const raw = shouldSyncUrl ? getPageFromUrl(searchParams, 1) : 1;
    return Math.max(1, raw);
  });

  const [perPage, setPerPageState] = useState(() => {
    const raw = shouldSyncUrl ? getPerPageFromUrl(searchParams, initialPerPage) : initialPerPage;
    return Math.max(minPerPage, raw);
  });

  const onPageChange = useCallback(
    (newPage: number) => {
      const clamped = Math.max(1, newPage);
      setPageState(clamped);
      if (shouldSyncUrl) {
        setSearchParams((prev) => updatePageInUrl(prev, clamped));
      }
    },
    [shouldSyncUrl, setSearchParams],
  );

  const onPerPageChange = useCallback(
    (newPerPage: number) => {
      const clamped = Math.max(minPerPage, newPerPage);
      setPerPageState(clamped);
      setPageState(1);
      if (shouldSyncUrl) {
        setSearchParams((prev) => updatePerPageInUrl(prev, clamped));
      }
    },
    [shouldSyncUrl, setSearchParams, minPerPage],
  );

  // State-only reset — no URL sync needed here because callers (useFiltersState,
  // useSortState) already delete the page param via updateFiltersInUrl / updateSortInUrl
  // when they write their own changes to the URL. Adding setSearchParams here would
  // race with those updates and overwrite the filter/sort params.
  const resetPage = useCallback(() => {
    setPageState(1);
  }, []);

  return {
    page,
    perPage,
    perPageOptions,
    onPageChange,
    onPerPageChange,
    resetPage,
  };
}
