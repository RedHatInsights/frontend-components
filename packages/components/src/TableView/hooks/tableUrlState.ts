/**
 * URL State Helpers for TableView
 *
 * Pure functions for reading/writing table state to URL search params.
 * These preserve non-table URL params (feature flags, routing context, etc.)
 */

import type { FilterState, SortDirection, SortState } from '../types';

// =============================================================================
// Constants
// =============================================================================

/** Table-managed URL param keys */
export const TABLE_URL_PARAMS = ['page', 'perPage', 'sortBy', 'sortDir'] as const;

// =============================================================================
// Read from URL
// =============================================================================

/** Get page from URL, falling back to default */
export function getPageFromUrl(searchParams: URLSearchParams, fallback: number): number {
  const urlPage = searchParams.get('page');
  const parsed = urlPage ? parseInt(urlPage, 10) : NaN;
  return Number.isNaN(parsed) ? fallback : parsed;
}

/** Get perPage from URL, falling back to default */
export function getPerPageFromUrl(searchParams: URLSearchParams, fallback: number): number {
  const urlPerPage = searchParams.get('perPage');
  const parsed = urlPerPage ? parseInt(urlPerPage, 10) : NaN;
  return Number.isNaN(parsed) ? fallback : parsed;
}

/** Get sort from URL, validating against allowed sortable columns */
export function getSortFromUrl<TSortable extends string>(
  searchParams: URLSearchParams,
  sortableColumns: readonly TSortable[],
  initialSort: SortState<TSortable> | undefined,
): SortState<TSortable> | null {
  const urlSort = searchParams.get('sortBy');
  const urlDirectionRaw = searchParams.get('sortDir');
  const urlDirection: SortDirection | null = urlDirectionRaw === 'asc' || urlDirectionRaw === 'desc' ? urlDirectionRaw : null;
  if (urlSort && (sortableColumns as readonly string[]).includes(urlSort)) {
    return { column: urlSort as TSortable, direction: urlDirection || 'asc' };
  }
  return initialSort || null;
}

/** Get filters from URL, excluding table-managed params */
export function getFiltersFromUrl(searchParams: URLSearchParams, initialFilters: FilterState): FilterState {
  const urlFilters: FilterState = {};

  // Group all values by key to handle repeated params (e.g., type=a&type=b)
  searchParams.forEach((rawValue, key) => {
    // Skip table-managed params
    if ((TABLE_URL_PARAMS as readonly string[]).includes(key)) return;

    // Decode the value (handles special characters)
    let value = rawValue;
    try {
      value = decodeURIComponent(rawValue);
    } catch {
      // leave raw value if percent-encoding is malformed
    }

    const existing = urlFilters[key];
    if (existing === undefined) {
      // Check if the initial value for this key is an array - if so, wrap in array
      // This ensures checkbox filters get array values even for single URL values
      const initialValue = initialFilters[key];
      if (Array.isArray(initialValue)) {
        urlFilters[key] = [value];
      } else {
        urlFilters[key] = value;
      }
    } else if (Array.isArray(existing)) {
      existing.push(value);
    } else {
      // Convert to array when we see a second value for the same key
      urlFilters[key] = [existing, value];
    }
  });

  return { ...initialFilters, ...urlFilters };
}

// =============================================================================
// Write to URL
// =============================================================================

/** Update page in URL, preserving all other params */
export function updatePageInUrl(searchParams: URLSearchParams, newPage: number): URLSearchParams {
  const next = new URLSearchParams(searchParams);
  if (newPage === 1) {
    next.delete('page');
  } else {
    next.set('page', String(newPage));
  }
  return next;
}

/** Update perPage in URL, preserving all other params and resetting page */
export function updatePerPageInUrl(searchParams: URLSearchParams, newPerPage: number): URLSearchParams {
  const next = new URLSearchParams(searchParams);
  next.set('perPage', String(newPerPage));
  next.delete('page'); // Reset page when perPage changes
  return next;
}

/** Update sort in URL, preserving all other params */
export function updateSortInUrl(searchParams: URLSearchParams, column: string, direction: SortDirection): URLSearchParams {
  const next = new URLSearchParams(searchParams);
  next.set('sortBy', column);
  next.set('sortDir', direction);
  return next;
}

/** Update filters in URL, preserving all non-filter params (including external params) */
export function updateFiltersInUrl(searchParams: URLSearchParams, newFilters: FilterState, oldFilters: FilterState): URLSearchParams {
  const next = new URLSearchParams(searchParams);

  // Reset page when filters change
  next.delete('page');

  // Remove old filter keys that are no longer in newFilters
  Object.keys(oldFilters).forEach((key) => {
    if (!(key in newFilters) || !newFilters[key] || (Array.isArray(newFilters[key]) && (newFilters[key] as string[]).length === 0)) {
      next.delete(key);
    }
  });

  // Add/update filter params using repeated params for arrays (e.g., type=a&type=b)
  // Values are encoded to handle special characters safely
  Object.entries(newFilters).forEach(([key, value]) => {
    // First delete existing values for this key
    next.delete(key);

    if (Array.isArray(value)) {
      // Use repeated params for arrays, encode each value
      value.forEach((v) => {
        if (v) next.append(key, encodeURIComponent(v));
      });
    } else if (value) {
      next.set(key, encodeURIComponent(value));
    }
  });

  return next;
}

/** Clear filters in URL, preserving all non-filter params (including external params) */
export function clearFiltersInUrl(searchParams: URLSearchParams, currentFilters: FilterState): URLSearchParams {
  const next = new URLSearchParams(searchParams);

  // Reset page when clearing filters
  next.delete('page');

  // Remove only filter keys (keys that exist in currentFilters)
  Object.keys(currentFilters).forEach((key) => {
    next.delete(key);
  });

  return next;
}
