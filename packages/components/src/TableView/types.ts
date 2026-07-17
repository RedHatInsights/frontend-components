import { ReactNode } from 'react';
import type { BaseCellProps } from '@patternfly/react-table/dist/dynamic/components/Table';
import type { CursorLinks } from './hooks/useCursorPaginationState';

/**
 * TableView Type System
 *
 * This module provides extreme TypeScript safety for table components.
 * Columns are defined as const tuples, enabling compile-time checking
 * of column names in filters, sorting, cell renderers, and expansion.
 */

// =============================================================================
// Enums
// =============================================================================

/**
 * Position enum for toolbar placement.
 * Safer than string literals for future maintenance.
 */
export enum ToolbarPosition {
  Top = 'top',
  Bottom = 'bottom',
}

// =============================================================================
// Column Configuration Types
// =============================================================================

/**
 * Configuration for a single column.
 * Minimal metadata - rendering is handled by cellRenderers map.
 */
export interface ColumnConfig {
  /** Display label for the column header. Accepts ReactNode for rich headers (e.g. with popovers). */
  label: ReactNode;
  /** Whether this column can be sorted */
  sortable?: boolean;
  /** Whether this column supports compound expansion (clicking opens expanded content) */
  isCompound?: boolean;
  /** Width percentage modifier — matches PatternFly Th width prop */
  width?: BaseCellProps['width'];
  /**
   * Column display format.
   * - `'date'`: Automatically formats the cell renderer's return value as a date.
   *   The cell renderer should return a date string (ISO 8601) or empty string.
   *   Dates within 3 months show relative format ("2 days ago"), older dates show
   *   full format ("15 Jun 2025"). Uses the shared `DateFormat` component and
   *   `getDateFormat` utility for consistent date handling across the app.
   */
  format?: 'date';
}

/**
 * Map of column IDs to their configuration.
 * TypeScript ensures all columns in TColumns are configured.
 */
export type ColumnConfigMap<TColumns extends readonly string[]> = {
  [K in TColumns[number]]: ColumnConfig;
};

/**
 * Extracts column IDs that have isCompound: true from the config.
 * Used to type the expansion-related props.
 */
export type ExtractCompoundColumns<TColumns extends readonly string[], TConfig extends ColumnConfigMap<TColumns>> = {
  [K in TColumns[number]]: TConfig[K] extends { isCompound: true } ? K : never;
}[TColumns[number]];

/**
 * Extracts column IDs that have sortable: true from the config.
 * Used to type the sorting-related props.
 */
export type ExtractSortableColumns<TColumns extends readonly string[], TConfig extends ColumnConfigMap<TColumns>> = {
  [K in TColumns[number]]: TConfig[K] extends { sortable: true } ? K : never;
}[TColumns[number]];

// =============================================================================
// Cell Renderer Types
// =============================================================================

/**
 * Map of column IDs to their cell render functions.
 * TypeScript ensures all columns have a renderer defined.
 */
export type CellRendererMap<TColumns extends readonly string[], TRow> = {
  [K in TColumns[number]]: (row: TRow) => ReactNode;
};

/**
 * Map of compound column IDs to their expansion render functions.
 * Only columns marked isCompound: true should be in this map.
 */
export type ExpansionRendererMap<TCompoundColumns extends string, TRow> = {
  [K in TCompoundColumns]: (row: TRow) => ReactNode;
};

// =============================================================================
// Filter Configuration Types
// =============================================================================

/**
 * Filter configuration - decoupled from columns.
 * Supports global search or field-specific filters.
 */
export type FilterConfig =
  | { type: 'search'; id: string; placeholder?: string }
  | { type: 'text'; id: string; label: string; placeholder?: string }
  | {
      type: 'select';
      id: string;
      label: string;
      options: Array<{ id: string; label: string }>;
    }
  | {
      type: 'checkbox';
      id: string;
      label: string;
      placeholder?: string;
      options: Array<{ id: string; label: string }>;
    };

/**
 * Filter state - simple record of filter ID to value.
 * String for text/search filters, string[] for select/checkbox.
 */
export type FilterState = Record<string, string | string[]>;

// =============================================================================
// Sort Types
// =============================================================================

/**
 * Sort direction - ascending or descending.
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sort state with strongly-typed column.
 */
export interface SortState<TSortable extends string> {
  column: TSortable;
  direction: SortDirection;
}

// =============================================================================
// Expansion Types
// =============================================================================

/**
 * Expanded cell state with strongly-typed column.
 * Only compound columns can be expanded.
 */
export interface ExpandedCell<TCompound extends string> {
  rowId: string;
  column: TCompound;
}

// =============================================================================
// useTableState Hook Types
// =============================================================================

/**
 * Options for useTableState hook.
 * Generic parameters ensure type safety for columns, rows, sortable, and compound columns.
 */
export interface UseTableStateOptions<
  TColumns extends readonly string[],
  TRow,
  TSortable extends TColumns[number] = never,
  TCompound extends TColumns[number] = never,
> {
  /** Column IDs as const tuple */
  columns: TColumns;

  /** Subset of columns that are sortable */
  sortableColumns?: readonly TSortable[];

  /** Subset of columns that support compound expansion */
  compoundColumns?: readonly TCompound[];

  /** Initial sort state */
  initialSort?: SortState<TSortable>;

  /** Initial items per page (default: 20) */
  initialPerPage?: number;

  /** Per-page options for pagination (default: [10, 20, 50, 100]) */
  perPageOptions?: number[];

  /** Initial filter values */
  initialFilters?: FilterState;

  /** Function to get unique ID from a row */
  getRowId: (row: TRow) => string;

  /** Function to determine if a row can be selected (default: all selectable) */
  isRowSelectable?: (row: TRow) => boolean;

  /** Initial selected rows (optional) */
  initialSelectedRows?: TRow[];

  /** Whether to sync state with URL search params */
  syncWithUrl?: boolean;

  /**
   * Pagination mode:
   * - 'offset' (default): Standard offset/limit pagination with total count.
   *   API returns { meta: { count, limit, offset } }.
   * - 'cursor': Cursor-based pagination without total count.
   *   API returns { meta: { limit }, links: { next, previous } }.
   *   Uses PF Pagination indeterminate mode ("X - Y of many").
   */
  paginationMode?: 'offset' | 'cursor';

  /**
   * Callback fired when table state changes and data should be refetched.
   * Called with the current API params (offset, limit, orderBy, filters).
   * In cursor mode, includes `cursor` instead of `offset`.
   * Debounced internally to avoid excessive calls during rapid changes (e.g., typing in filter).
   */
  onStaleData?: (params: {
    offset: number;
    cursor?: string;
    limit: number;
    orderBy?: `${TSortable}` | `-${TSortable}`;
    filters: FilterState;
  }) => void;

  /** Debounce delay for onStaleData in ms (default: 300) */
  staleDataDebounceMs?: number;
}

/**
 * Return type for useTableState hook.
 * Provides all state and callbacks needed by TableView.
 */
export interface UseTableStateReturn<
  TColumns extends readonly string[],
  TRow,
  TSortable extends TColumns[number],
  TCompound extends TColumns[number],
> {
  // -------------------------------------------------------------------------
  // Sorting - typed to sortable columns only
  // -------------------------------------------------------------------------
  /** Current sort state, null if unsorted */
  sort: SortState<TSortable> | null;
  /** Callback to change sort */
  onSortChange: (column: TSortable, direction: SortDirection) => void;

  // -------------------------------------------------------------------------
  // Pagination
  // -------------------------------------------------------------------------
  /** Current page number (1-indexed) */
  page: number;
  /** Items per page */
  perPage: number;
  /** Available per-page options for pagination dropdown */
  perPageOptions: number[];
  /** Callback to change page */
  onPageChange: (page: number) => void;
  /** Callback to change items per page */
  onPerPageChange: (perPage: number) => void;

  // -------------------------------------------------------------------------
  // Selection
  // -------------------------------------------------------------------------
  /** Currently selected rows */
  selectedRows: TRow[];
  /** Callback to select/deselect a single row */
  onSelectRow: (row: TRow, selected: boolean) => void;
  /** Callback to select/deselect all rows (on current page) */
  onSelectAll: (selected: boolean, rows: TRow[]) => void;
  /** Clear all selections */
  clearSelection: () => void;

  // -------------------------------------------------------------------------
  // Expansion - typed to compound columns only
  // -------------------------------------------------------------------------
  /** Currently expanded cell, null if none expanded */
  expandedCell: ExpandedCell<TCompound> | null;
  /** Callback to toggle expansion of a cell */
  onToggleExpand: (rowId: string, column: TCompound) => void;

  // -------------------------------------------------------------------------
  // Filters
  // -------------------------------------------------------------------------
  /** Current filter values */
  filters: FilterState;
  /** Callback to update filters */
  onFiltersChange: (filters: FilterState) => void;
  /** Clear all filters */
  clearAllFilters: () => void;

  // -------------------------------------------------------------------------
  // Utility functions for cell-level checks
  // -------------------------------------------------------------------------
  /** Check if a row is currently selected */
  isRowSelected: (row: TRow) => boolean;
  /** Check if a specific cell is expanded */
  isCellExpanded: (rowId: string, column: TCompound) => boolean;
  /** Check if any cell in a row is expanded */
  isAnyExpanded: (rowId: string) => boolean;

  // -------------------------------------------------------------------------
  // Cursor pagination (only present when paginationMode: 'cursor')
  // -------------------------------------------------------------------------
  /** Whether there is a next page (cursor mode only, for TableView) */
  hasNextPage?: boolean;
  /** Whether there is a previous page (cursor mode only, for TableView) */
  hasPreviousPage?: boolean;
  /** Cursor pagination extras (undefined in offset mode) */
  cursorMeta?: {
    /** Feed the API response links back to the hook after each fetch */
    setCursorLinks: (links: CursorLinks) => void;
    /** Whether there is a next page */
    hasNextPage: boolean;
    /** Whether there is a previous page */
    hasPreviousPage: boolean;
  };

  // -------------------------------------------------------------------------
  // API params helper - ready to pass to fetch functions
  // -------------------------------------------------------------------------
  apiParams: {
    offset: number;
    cursor?: string;
    limit: number;
    orderBy?: `${TSortable}` | `-${TSortable}`;
    filters: FilterState;
  };
}

// =============================================================================
// TableView Component Types
// =============================================================================

/**
 * Props for the TableView component.
 * Fully typed with generics for columns, rows, sortable columns, and compound columns.
 */
export interface TableViewProps<
  TColumns extends readonly string[],
  TRow,
  TSortable extends TColumns[number] = never,
  TCompound extends TColumns[number] = never,
> {
  // -------------------------------------------------------------------------
  // Column definitions
  // -------------------------------------------------------------------------
  /** Column IDs as const tuple */
  columns: TColumns;
  /** Configuration for each column */
  columnConfig: ColumnConfigMap<TColumns>;
  /** Subset of columns that are sortable (for type inference) */
  sortableColumns?: readonly TSortable[];

  // -------------------------------------------------------------------------
  // Data
  // -------------------------------------------------------------------------
  /** Row data - undefined means loading state */
  data: TRow[] | undefined;
  /** Total count of rows (for pagination). Omit for cursor-based pagination (indeterminate mode). */
  totalCount?: number;
  /** Function to get unique ID from a row */
  getRowId: (row: TRow) => string;

  // -------------------------------------------------------------------------
  // Cell rendering (mapping objects)
  // -------------------------------------------------------------------------
  /** Map of column IDs to cell render functions */
  cellRenderers: CellRendererMap<TColumns, TRow>;
  /** Map of compound column IDs to expansion render functions */
  expansionRenderers?: ExpansionRendererMap<TCompound, TRow>;

  // -------------------------------------------------------------------------
  // Sorting
  // -------------------------------------------------------------------------
  /** Current sort state */
  sort?: SortState<TSortable> | null;
  /** Callback when sort changes */
  onSortChange?: (column: TSortable, direction: SortDirection) => void;

  // -------------------------------------------------------------------------
  // Pagination
  // -------------------------------------------------------------------------
  /** Current page (1-indexed) */
  page: number;
  /** Items per page */
  perPage: number;
  /** Available per-page options for pagination dropdown (default: [10, 20, 50, 100]) */
  perPageOptions?: number[];
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Callback when per-page changes */
  onPerPageChange: (perPage: number) => void;
  /** Whether there is a next page (cursor pagination mode) */
  hasNextPage?: boolean;
  /** Whether there is a previous page (cursor pagination mode) */
  hasPreviousPage?: boolean;

  // -------------------------------------------------------------------------
  // Selection
  // -------------------------------------------------------------------------
  /** Whether rows can be selected */
  selectable?: boolean;
  /** Currently selected rows */
  selectedRows?: TRow[];
  /** Callback when a row is selected/deselected */
  onSelectRow?: (row: TRow, selected: boolean) => void;
  /** Callback when select all is toggled - component provides current page rows */
  onSelectAll?: (selected: boolean, rows: TRow[]) => void;
  /** Function to determine if a specific row can be selected */
  isRowSelectable?: (row: TRow) => boolean;

  // -------------------------------------------------------------------------
  // Expansion
  // -------------------------------------------------------------------------
  /** Currently expanded cell */
  expandedCell?: ExpandedCell<TCompound> | null;
  /** Callback when expansion is toggled */
  onToggleExpand?: (rowId: string, column: TCompound) => void;
  /** Function to determine if a specific cell can be expanded (default: all expandable) */
  isCellExpandable?: (row: TRow, column: TCompound) => boolean;
  /** Callback fired when a cell is expanded - use to fetch expanded data */
  onExpand?: (row: TRow, column: TCompound) => void;

  // -------------------------------------------------------------------------
  // Row actions
  // -------------------------------------------------------------------------
  /** Render function for row actions menu */
  renderActions?: (row: TRow) => ReactNode;

  // -------------------------------------------------------------------------
  // Row click
  // -------------------------------------------------------------------------
  /** Callback when a row is clicked */
  onRowClick?: (row: TRow) => void;
  /** Function to determine if a row is clickable */
  isRowClickable?: (row: TRow) => boolean;

  // -------------------------------------------------------------------------
  // Filtering (rendered in toolbar)
  // -------------------------------------------------------------------------
  /** Filter configuration */
  filterConfig?: FilterConfig[];
  /** Current filter values */
  filters?: FilterState;
  /** Callback when filters change */
  onFiltersChange?: (filters: FilterState) => void;
  /** Clear all filters callback */
  clearAllFilters?: () => void;

  // -------------------------------------------------------------------------
  // Toolbar content
  // -------------------------------------------------------------------------
  /** Custom actions to render in toolbar (always visible) */
  toolbarActions?: ReactNode;
  /** Bulk actions to render when rows are selected */
  bulkActions?: ReactNode;

  // -------------------------------------------------------------------------
  // Error state
  // -------------------------------------------------------------------------
  /** Error object when data fetching fails */
  error?: Error | null;

  // -------------------------------------------------------------------------
  // Empty states
  // -------------------------------------------------------------------------
  /** Empty state when there's no data at all (optional - uses default if not provided) */
  emptyStateNoData?: ReactNode;
  /** Empty state when filters return no results (optional - uses default if not provided) */
  emptyStateNoResults?: ReactNode;
  /** Error state when fetching fails (optional - uses default if not provided) */
  emptyStateError?: ReactNode;

  // -------------------------------------------------------------------------
  // Configuration
  // -------------------------------------------------------------------------
  /** Table variant */
  variant?: 'default' | 'compact';
  /** OUIA ID for testing */
  ouiaId?: string;
  /** Aria label for accessibility */
  ariaLabel: string;
}
