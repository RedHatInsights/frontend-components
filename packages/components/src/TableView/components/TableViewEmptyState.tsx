/**
 * TableViewEmptyState Components
 *
 * Provides proper table structure wrapping for empty states.
 * Users can use these for custom empty states with correct table markup.
 */

import React, { ReactNode } from 'react';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table/dist/dynamic/components/Table';
import { TableVariant } from '@patternfly/react-table';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { EmptyState, EmptyStateActions, EmptyStateBody, EmptyStateFooter } from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon';
import CubesIcon from '@patternfly/react-icons/dist/js/icons/cubes-icon';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';

// =============================================================================
// Default Empty State Content Components
// =============================================================================

export interface DefaultEmptyStateNoDataProps {
  /** Custom title */
  title?: string;
  /** Custom body text or element */
  body?: React.ReactNode;
}

/**
 * Default empty state content for when there is no data.
 * Use this inside TableViewEmptyState or standalone.
 */
export const DefaultEmptyStateNoData: React.FC<DefaultEmptyStateNoDataProps> = ({
  title = 'No data available',
  body = 'There is no data to display.',
}) => (
  <EmptyState headingLevel="h4" icon={CubesIcon} titleText={title} variant="lg">
    <EmptyStateBody>{body}</EmptyStateBody>
  </EmptyState>
);

export interface DefaultEmptyStateNoResultsProps {
  /** Custom title */
  title?: string;
  /** Custom body text or element */
  body?: React.ReactNode;
  /** Callback to clear filters */
  onClearFilters?: () => void;
  /** Custom clear filters button text */
  clearFiltersText?: string;
}

/**
 * Default empty state content for when filters return no results.
 * Use this inside TableViewEmptyState or standalone.
 */
export const DefaultEmptyStateNoResults: React.FC<DefaultEmptyStateNoResultsProps> = ({
  title = 'No results found',
  body = 'No results match the filter criteria. Clear all filters to show results.',
  onClearFilters,
  clearFiltersText = 'Clear all filters',
}) => (
  <EmptyState headingLevel="h4" icon={SearchIcon} titleText={title} variant="lg">
    <EmptyStateBody>{body}</EmptyStateBody>
    {onClearFilters && (
      <EmptyStateFooter>
        <EmptyStateActions>
          <Button variant="link" onClick={onClearFilters}>
            {clearFiltersText}
          </Button>
        </EmptyStateActions>
      </EmptyStateFooter>
    )}
  </EmptyState>
);

export interface DefaultEmptyStateErrorProps {
  /** Custom title */
  title?: string;
  /** Custom body text */
  body?: string;
  /** Error object for additional details */
  error?: Error | null;
  /** Callback to retry the failed operation */
  onRetry?: () => void;
  /** Custom retry button text */
  retryText?: string;
}

/**
 * Default empty state content for when data fetching fails.
 * Use this inside TableViewEmptyState or standalone.
 */
export const DefaultEmptyStateError: React.FC<DefaultEmptyStateErrorProps> = ({
  title = 'Unable to load data',
  body = 'There was a problem loading the data. Please try again.',
  error,
  onRetry,
  retryText = 'Retry',
}) => (
  <EmptyState headingLevel="h4" icon={ExclamationCircleIcon} titleText={title} variant="lg">
    <EmptyStateBody>
      {body}
      {error?.message && (
        <>
          <br />
          <small>Error: {error.message}</small>
        </>
      )}
    </EmptyStateBody>
    {onRetry && (
      <EmptyStateFooter>
        <EmptyStateActions>
          <Button variant="primary" onClick={onRetry}>
            {retryText}
          </Button>
        </EmptyStateActions>
      </EmptyStateFooter>
    )}
  </EmptyState>
);

// =============================================================================
// Table Wrapper Component
// =============================================================================

export interface TableViewEmptyStateProps {
  /** Empty state content to display */
  children: ReactNode;
  /** Whether to show table headers (for "no results" state) */
  showHeaders?: boolean;
  /** Column labels for table header (required when showHeaders is true) */
  columnLabels?: ReactNode[];
  /** Whether to show selection column */
  hasSelection?: boolean;
  /** Whether to show actions column */
  hasActions?: boolean;
  /** Table variant */
  variant?: 'default' | 'compact';
  /** ARIA label for the table */
  ariaLabel?: string;
  /** OUIA ID for testing */
  ouiaId?: string;
}

/**
 * Renders empty state content with optional table headers.
 * - For "no data" state: renders content without table structure
 * - For "no results" state: renders content within table structure with headers
 *
 * @example
 * ```tsx
 * // No data - no headers
 * <TableViewEmptyState>
 *   <DefaultEmptyStateNoData />
 * </TableViewEmptyState>
 *
 * // No results - with headers
 * <TableViewEmptyState
 *   showHeaders
 *   columnLabels={['Name', 'Description', 'Status']}
 *   hasSelection
 *   ariaLabel="My table"
 * >
 *   <DefaultEmptyStateNoResults />
 * </TableViewEmptyState>
 * ```
 */
export const TableViewEmptyState: React.FC<TableViewEmptyStateProps> = ({
  children,
  showHeaders = false,
  columnLabels = [],
  hasSelection = false,
  hasActions = false,
  variant = 'default',
  ariaLabel = 'Table',
  ouiaId,
}) => {
  // No headers mode - just render content
  if (!showHeaders) {
    return <>{children}</>;
  }

  // With headers mode - render full table structure
  const columnCount = columnLabels.length + (hasSelection ? 1 : 0) + (hasActions ? 1 : 0);

  return (
    <Table aria-label={ariaLabel} variant={variant === 'compact' ? TableVariant.compact : undefined} ouiaId={ouiaId}>
      <Thead>
        <Tr>
          {hasSelection && <Th screenReaderText="Select" modifier="fitContent" />}
          {columnLabels.map((label, idx) => (
            <Th key={idx}>{label}</Th>
          ))}
          {hasActions && <Th screenReaderText="Actions" modifier="fitContent" />}
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td colSpan={columnCount}>{children}</Td>
        </Tr>
      </Tbody>
    </Table>
  );
};
