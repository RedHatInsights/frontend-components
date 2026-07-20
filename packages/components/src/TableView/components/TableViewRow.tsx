/**
 * TableViewRow Component
 *
 * Internal component for rendering a single table row with:
 * - Selection checkbox
 * - Cell content via renderers
 * - Compound expansion support
 * - Row actions
 */

import React from 'react';
import { Tbody, Td, Tr } from '@patternfly/react-table/dist/dynamic/components/Table';
import { ExpandableRowContent } from '@patternfly/react-table/dist/dynamic/components/Table';
import DateFormat from '../../DateFormat';
import type { CellRendererMap, ColumnConfigMap, ExpansionRendererMap } from '../types';

function getDateFormat(date: string): 'onlyDate' | 'relative' {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  return Date.parse(date) < threeMonthsAgo.getTime() ? 'onlyDate' : 'relative';
}

export interface TableViewRowProps<TColumns extends readonly string[], TRow, TCompound extends string> {
  /** Row data */
  row: TRow;
  /** Row index in the data array */
  rowIndex: number;
  /** Unique ID for this row */
  rowId: string;
  /** Column IDs */
  columns: TColumns;

  // Selection
  /** Whether selection is enabled */
  selectable: boolean;
  /** Whether this row can be selected */
  canSelect: boolean;
  /** Whether this row is currently selected */
  isSelected: boolean;
  /** Callback when row selection changes */
  onSelectRow?: (row: TRow, isSelecting: boolean) => void;

  // Click
  /** Whether this row is clickable */
  isClickable: boolean;
  /** Callback when row is clicked */
  onRowClick?: (row: TRow) => void;

  // Expansion
  /** Whether this table has compound-expandable columns */
  hasExpansion: boolean;
  /** Currently expanded cell info */
  expandedCell?: { rowId: string; column: TCompound } | null;
  /** Expansion content renderers */
  expansionRenderers?: ExpansionRendererMap<TCompound, TRow>;
  /** Check if a cell can be expanded */
  isCellExpandable: (row: TRow, column: TCompound) => boolean;
  /** Callback when expansion is toggled */
  onToggleExpand?: (row: TRow, column: TCompound) => void;

  // Config
  /** Set of compound column IDs */
  compoundColumnSet: Set<string>;
  /** Column configuration */
  columnConfig: ColumnConfigMap<TColumns>;
  /** Cell content renderers */
  cellRenderers: CellRendererMap<TColumns, TRow>;
  /** Render actions for this row */
  renderActions?: (row: TRow) => React.ReactNode;
  /** Total column count (for colspan) */
  columnCount: number;
}

/**
 * Internal row component for TableView.
 * Renders a single row with cells, expansion, and actions.
 */
export function TableViewRow<TColumns extends readonly string[], TRow, TCompound extends string>({
  row,
  rowIndex,
  rowId,
  columns,
  selectable,
  canSelect,
  isSelected,
  onSelectRow,
  isClickable,
  onRowClick,
  hasExpansion,
  expandedCell,
  expansionRenderers,
  isCellExpandable,
  onToggleExpand,
  compoundColumnSet,
  columnConfig,
  cellRenderers,
  renderActions,
  columnCount,
}: TableViewRowProps<TColumns, TRow, TCompound>): React.ReactElement {
  const isExpanded = expandedCell?.rowId === rowId;
  const expandedColumnId = isExpanded ? expandedCell?.column : undefined;
  const expansionRenderer = expandedColumnId ? expansionRenderers?.[expandedColumnId as keyof typeof expansionRenderers] : undefined;

  const handleRowClick = (event?: React.MouseEvent | React.KeyboardEvent) => {
    if (!event || !('target' in event)) return;
    // Don't trigger row click if clicking on checkbox, button, or actions
    const target = event.target as HTMLElement;
    if (target.closest('input[type="checkbox"]') || target.closest('button') || target.closest('[data-actions]')) {
      return;
    }
    // Only handle mouse clicks (not keyboard) - keyboard activation should use proper a11y patterns
    if ('button' in event) {
      onRowClick?.(row);
    }
  };

  const isCellExpanded = (columnId: string): boolean => {
    return expandedCell?.rowId === rowId && expandedCell?.column === columnId;
  };

  const mainRow = (
    <Tr isClickable={isClickable} isRowSelected={isSelected} onRowClick={isClickable && onRowClick ? handleRowClick : undefined}>
      {selectable && (
        <Td
          className={!canSelect ? 'pf-v6-c-table__check' : undefined}
          select={
            canSelect && onSelectRow
              ? {
                  rowIndex,
                  onSelect: (_e, isSelecting) => onSelectRow(row, isSelecting),
                  isSelected,
                }
              : undefined
          }
        />
      )}

      {columns.map((col) => {
        const isCompound = compoundColumnSet.has(col);
        const canExpand = isCompound && isCellExpandable(row, col as TCompound);
        const cellExpanded = isCellExpanded(col);
        const colConfig = columnConfig[col as keyof typeof columnConfig];
        const rawLabel = colConfig?.label;
        const dataLabel = typeof rawLabel === 'string' ? rawLabel : col;

        const cellContent = cellRenderers[col as keyof typeof cellRenderers](row);
        const formattedContent =
          colConfig?.format === 'date' && typeof cellContent === 'string' && cellContent ? (
            <DateFormat date={cellContent} type={getDateFormat(cellContent)} />
          ) : (
            cellContent
          );

        return (
          <Td
            key={col}
            dataLabel={dataLabel}
            compoundExpand={
              canExpand && onToggleExpand
                ? {
                    isExpanded: cellExpanded,
                    onToggle: () => onToggleExpand(row, col as TCompound),
                  }
                : undefined
            }
          >
            {formattedContent}
          </Td>
        );
      })}

      {renderActions && (
        <Td data-actions isActionCell>
          {renderActions(row)}
        </Td>
      )}
    </Tr>
  );

  if (!hasExpansion) {
    return mainRow;
  }

  return (
    <Tbody isExpanded={isExpanded}>
      {mainRow}
      {expansionRenderer && (
        <Tr key={`${rowId}-${expandedColumnId}-expansion`} isExpanded>
          <Td colSpan={columnCount}>
            <ExpandableRowContent>{expansionRenderer(row)}</ExpandableRowContent>
          </Td>
        </Tr>
      )}
    </Tbody>
  );
}
