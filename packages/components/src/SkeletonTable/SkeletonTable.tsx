import React from 'react';
import { RowSelectVariant, Table, TableHeader, TableBody, IRow, ICell, TableVariant } from '@patternfly/react-table';
import { Skeleton, SkeletonSize } from '../Skeleton';
import classNames from 'classnames';

import './SkeletonTable.scss';

export interface SkeletonTableProps {
  colSize?: number;
  rowSize?: number;
  columns?: (ICell | string)[];
  paddingColumnSize?: number;
  sortBy?: {
    index?: number;
    direction?: 'asc' | 'desc';
  };
  isSelectable?: boolean;
  canSelectAll?: boolean;
  hasRadio?: boolean;
  variant?: TableVariant;
  isDark?: boolean;
}

const SkeletonTable: React.FunctionComponent<SkeletonTableProps> = ({
  canSelectAll = false,
  isSelectable = false,
  sortBy,
  variant,
  isDark = false,
  colSize = 0,
  columns,
  paddingColumnSize = 0,
  hasRadio = false,
  rowSize = 0,
}) => {
  const newArray = (size: number) => [...Array(size)];
  const createColumns = () => {
    return [...Array(colSize)].map(() => ({ title: <Skeleton isDark={isDark} size={SkeletonSize.sm} /> }));
  };

  const getColumns = (): (ICell | string)[] => {
    return newArray(paddingColumnSize)
      .map<ICell | string>(() => '')
      .concat(columns || createColumns());
  };

  const createRows = (): (IRow | string[])[] => {
    const numberOfCols = columns ? columns.length : colSize;
    return newArray(rowSize).map(() => ({
      disableSelection: true,
      cells: newArray(paddingColumnSize)
        .map<{ title: React.ReactNode } | string>(() => '')
        .concat(newArray(numberOfCols).map(() => ({ title: <Skeleton isDark={isDark} size={SkeletonSize.md} /> }))),
    }));
  };

  const selectVariant = (): RowSelectVariant => {
    return hasRadio ? RowSelectVariant?.radio || 'radio' : RowSelectVariant?.checkbox || 'checkbox';
  };

  return (
    <Table
      className={classNames({
        'ins-c-skeleton-table__dark': isDark,
      })}
      cells={getColumns()}
      rows={createRows()}
      sortBy={sortBy}
      aria-label="Loading"
      onSelect={isSelectable ? () => undefined : undefined}
      selectVariant={isSelectable ? selectVariant() : undefined}
      canSelectAll={canSelectAll}
      variant={variant}
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
};

export default SkeletonTable;
