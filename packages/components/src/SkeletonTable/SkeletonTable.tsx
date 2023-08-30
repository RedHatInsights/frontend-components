import React, { ReactNode } from 'react';
import { Caption, Table, TableProps, TableVariant, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { Skeleton } from '../Skeleton';

import './SkeletonTable.scss';

export type SkeletonTableProps = TableProps & {
  variant?: TableVariant;
  rows?: number;
  caption?: ReactNode;
} & (
    | {
        columns: ReactNode[];
      }
    | {
        numberOfColumns: number;
      }
  );

function hasCustomColumns(props: Record<string, any>): props is SkeletonTableProps & {
  columns: ReactNode[];
} {
  return Array.isArray(props.columns);
}

const SkeletonTable: React.FunctionComponent<SkeletonTableProps> = (props) => {
  const { variant, rows = 5, caption } = props;
  const rowCells = hasCustomColumns(props) ? props.columns.length : props.numberOfColumns;
  const rowArray = [...new Array(rowCells)];
  const bodyRows = [...new Array(rows)].map((_, index) => (
    <Tr key={index}>
      {rowArray.map((_, index) => (
        <Td key={index}>
          <Skeleton />
        </Td>
      ))}
    </Tr>
  ));

  return (
    <Table aria-label="Loading" variant={variant}>
      {caption && <Caption>{caption}</Caption>}
      <Thead>
        <Tr>
          {hasCustomColumns(props)
            ? props.columns.map((c, index) => <Th key={index}>{c}</Th>)
            : rowArray.map((_, index) => (
                <Th key={index}>
                  <Skeleton />
                </Th>
              ))}
        </Tr>
      </Thead>
      <Tbody>{bodyRows}</Tbody>
    </Table>
  );
};

export default SkeletonTable;
