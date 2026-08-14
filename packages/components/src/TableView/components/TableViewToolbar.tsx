/**
 * TableViewToolbar Component
 *
 * Internal component for rendering the table toolbar.
 * Handles filters, bulk selection, pagination, and actions.
 *
 * Supports two pagination modes:
 * - When totalCount is provided: standard pagination with "X of Y" display
 * - When totalCount is undefined: PF indeterminate mode ("X - Y of many")
 *   Used for cursor-based APIs that don't return a total count.
 */

import React, { Fragment, ReactNode } from 'react';
import { Pagination } from '@patternfly/react-core/dist/dynamic/components/Pagination';
import { ToolbarGroup } from '@patternfly/react-core';
import { BulkSelect, BulkSelectValue } from '@patternfly/react-component-groups/dist/dynamic/BulkSelect';
import { DataViewToolbar } from '@patternfly/react-data-view/dist/dynamic/DataViewToolbar';
import { ToolbarPosition } from '../types';

export interface TableViewToolbarProps {
  /** Position - top or bottom toolbar */
  position: ToolbarPosition;
  /** OUIA ID for testing */
  ouiaId?: string;

  // Pagination
  /** Total item count. When undefined, renders PF indeterminate pagination ("X - Y of many"). */
  totalCount?: number;
  /** Current page */
  page: number;
  /** Items per page */
  perPage: number;
  /** Available per-page options */
  perPageOptions?: number[];
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Callback when per page changes */
  onPerPageChange: (perPage: number) => void;
  /** Whether there is a next page (cursor pagination mode) */
  hasNextPage?: boolean;
  /** Whether there is a previous page (cursor pagination mode) */
  hasPreviousPage?: boolean;

  // Filters - presence of filters prop enables filter display
  /** Filter components */
  filters?: ReactNode;
  /** Clear all filters callback */
  clearAllFilters?: () => void;

  // Selection - presence of onBulkSelect enables bulk selection
  /** Number of selectable items on current page */
  selectableCount?: number;
  /** Number of currently selected items */
  selectedCount?: number;
  /** Whether all selectable items on page are selected */
  pageSelected?: boolean;
  /** Whether some but not all selectable items on page are selected */
  pagePartiallySelected?: boolean;
  /** Callback for bulk select actions - presence enables bulk select */
  onBulkSelect?: (value: BulkSelectValue) => void;

  // Actions
  /** Action elements */
  actions?: ReactNode;
}

/**
 * Internal toolbar component for TableView.
 * Renders bulk select, filters, actions, and pagination.
 */
export const TableViewToolbar: React.FC<TableViewToolbarProps> = ({
  position,
  ouiaId,
  totalCount,
  page,
  perPage,
  perPageOptions,
  onPageChange,
  onPerPageChange,
  hasNextPage,
  hasPreviousPage,
  filters,
  clearAllFilters,
  selectableCount = 0,
  selectedCount = 0,
  pageSelected = false,
  pagePartiallySelected = false,
  onBulkSelect,
  actions,
}) => {
  const isTopToolbar = position === ToolbarPosition.Top;
  const isIndeterminate = totalCount === undefined;

  // Use prop existence as feature toggles - no separate boolean flags needed
  const hasBulkSelect = isTopToolbar && onBulkSelect && selectableCount > 0;
  const hasFilters = !!filters;
  const hasActions = isTopToolbar && !!actions;
  // Show pagination when there's data: either a known count > 0, or indeterminate mode
  const hasPagination = isIndeterminate || (totalCount !== undefined && totalCount > 0);

  // Don't render if nothing to show
  if (!hasFilters && !hasBulkSelect && !hasActions && !hasPagination) {
    return null;
  }

  return (
    <DataViewToolbar
      ouiaId={ouiaId}
      bulkSelect={
        hasBulkSelect ? (
          <BulkSelect
            isDataPaginated
            selectedCount={selectedCount}
            totalCount={totalCount ?? 0}
            pageCount={selectableCount}
            pageSelected={pageSelected}
            pagePartiallySelected={pagePartiallySelected}
            onSelect={onBulkSelect}
          />
        ) : undefined
      }
      filters={hasFilters ? <ToolbarGroup variant="filter-group">{filters}</ToolbarGroup> : undefined}
      clearAllFilters={clearAllFilters}
      actions={hasActions ? actions : undefined}
      pagination={
        hasPagination ? (
          <Pagination
            {...(isIndeterminate ? {} : { itemCount: totalCount })}
            {...(typeof hasNextPage === 'boolean' ? { isLastPage: !hasNextPage } : {})}
            {...(typeof hasPreviousPage === 'boolean' ? { isFirstPage: !hasPreviousPage } : {})}
            {...(isIndeterminate
              ? {
                  toggleTemplate: ({ firstIndex, lastIndex }: { firstIndex?: number; lastIndex?: number }) => (
                    <Fragment>
                      <b>
                        {firstIndex} - {lastIndex}
                      </b>{' '}
                      of <b>many</b>
                    </Fragment>
                  ),
                }
              : {})}
            page={page}
            perPage={perPage}
            perPageOptions={perPageOptions?.map((n) => ({ title: String(n), value: n }))}
            onSetPage={(_e, newPage) => onPageChange(newPage)}
            onPerPageSelect={(_e, newPerPage) => onPerPageChange(newPerPage)}
            variant={!isIndeterminate && position === ToolbarPosition.Bottom ? 'bottom' : undefined}
            isCompact={isTopToolbar || isIndeterminate}
          />
        ) : undefined
      }
    />
  );
};
