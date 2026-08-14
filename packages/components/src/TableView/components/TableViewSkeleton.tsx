/**
 * TableViewSkeleton Component
 *
 * Loading skeleton for TableView with proper table structure.
 */

import React from 'react';
import { Table } from '@patternfly/react-table/dist/dynamic/components/Table';
import { TableVariant } from '@patternfly/react-table';
import { SkeletonTableBody, SkeletonTableHead } from '@patternfly/react-component-groups';

export interface TableViewSkeletonProps {
  /** Column labels for skeleton header (must be strings — JSX causes DOM nesting warnings) */
  columnLabels: string[];
  /** Number of rows to show */
  rowCount: number;
  /** Whether to show selection column */
  hasSelection?: boolean;
  /** Whether to show actions column */
  hasActions?: boolean;
  /** Table variant */
  variant?: 'default' | 'compact';
  /** ARIA label for the table */
  ariaLabel: string;
  /** OUIA ID for testing */
  ouiaId?: string;
}

/**
 * Loading skeleton for TableView.
 * Shows animated placeholder rows while data is loading.
 */
export const TableViewSkeleton: React.FC<TableViewSkeletonProps> = ({
  columnLabels,
  rowCount,
  hasSelection = false,
  hasActions = false,
  variant = 'default',
  ariaLabel,
  ouiaId,
}) => {
  const columnCount = columnLabels.length + (hasSelection ? 1 : 0) + (hasActions ? 1 : 0);

  return (
    <Table aria-label={ariaLabel} variant={variant === 'compact' ? TableVariant.compact : undefined} ouiaId={ouiaId}>
      <SkeletonTableHead columns={columnLabels} />
      <SkeletonTableBody rowsCount={rowCount} columnsCount={columnCount} />
    </Table>
  );
};
