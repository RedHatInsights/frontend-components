/**
 * useExpansionState Hook
 *
 * Manages compound expansion state for TableView.
 */

import { useCallback, useState } from 'react';
import type { ExpandedCell } from '../types';

export interface UseExpansionStateReturn<TCompound extends string> {
  /** Currently expanded cell */
  expandedCell: ExpandedCell<TCompound> | null;
  /** Toggle expansion of a cell */
  onToggleExpand: (rowId: string, column: TCompound) => void;
  /** Check if a specific cell is expanded */
  isCellExpanded: (rowId: string, column: TCompound) => boolean;
  /** Check if any cell in a row is expanded */
  isAnyExpanded: (rowId: string) => boolean;
}

/**
 * Hook for managing compound expansion state.
 */
export function useExpansionState<TCompound extends string>(): UseExpansionStateReturn<TCompound> {
  const [expandedCell, setExpandedCell] = useState<ExpandedCell<TCompound> | null>(null);

  const onToggleExpand = useCallback((rowId: string, column: TCompound) => {
    setExpandedCell((prev) => {
      if (prev?.rowId === rowId && prev?.column === column) {
        return null;
      }
      return { rowId, column };
    });
  }, []);

  const isCellExpanded = useCallback(
    (rowId: string, column: TCompound): boolean => {
      return expandedCell?.rowId === rowId && expandedCell?.column === column;
    },
    [expandedCell],
  );

  const isAnyExpanded = useCallback(
    (rowId: string): boolean => {
      return expandedCell?.rowId === rowId;
    },
    [expandedCell],
  );

  return {
    expandedCell,
    onToggleExpand,
    isCellExpanded,
    isAnyExpanded,
  };
}
