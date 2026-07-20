/**
 * TableView Component Library
 *
 * A type-safe, flexible table component with:
 * - Const tuple columns for extreme TypeScript safety
 * - Decoupled filtering from columns
 * - Compound expandable rows
 * - Optional URL state synchronization
 * - Reusable building blocks for custom implementations
 */

// Types and Enums
export { ToolbarPosition } from './types';

export type {
  // Column types
  ColumnConfig,
  ColumnConfigMap,
  ExtractCompoundColumns,
  ExtractSortableColumns,
  // Renderer types
  CellRendererMap,
  ExpansionRendererMap,
  // Filter types
  FilterConfig,
  FilterState,
  // Sort types
  SortDirection,
  SortState,
  // Expansion types
  ExpandedCell,
  // Hook types
  UseTableStateOptions,
  UseTableStateReturn,
  // Component types
  TableViewProps,
} from './types';

// Main Component
export { TableView } from './TableView';

// Hooks
export { useTableState } from './hooks/useTableState';
export { useRowSelection, type UseRowSelectionOptions, type UseRowSelectionReturn } from './hooks/useRowSelection';
export {
  useCursorPaginationState,
  type CursorLinks,
  type UseCursorPaginationStateOptions,
  type UseCursorPaginationStateReturn,
} from './hooks/useCursorPaginationState';

// Reusable Building Blocks (for custom implementations)
export {
  TableViewEmptyState,
  type TableViewEmptyStateProps,
  DefaultEmptyStateNoData,
  type DefaultEmptyStateNoDataProps,
  DefaultEmptyStateNoResults,
  type DefaultEmptyStateNoResultsProps,
  DefaultEmptyStateError,
  type DefaultEmptyStateErrorProps,
} from './components/TableViewEmptyState';
export { TableViewSkeleton, type TableViewSkeletonProps } from './components/TableViewSkeleton';
export { TableViewFilters, type TableViewFiltersProps } from './components/TableViewFilters';
export { TableViewToolbar, type TableViewToolbarProps } from './components/TableViewToolbar';
