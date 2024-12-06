import React, { Fragment } from 'react';
import { Bullseye } from '@patternfly/react-core/dist/dynamic/layouts/Bullseye';
import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';

import { EmptyStateVariant } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { ModalProps } from '@patternfly/react-core/dist/dynamic/components/Modal';
import { Pagination } from '@patternfly/react-core/dist/dynamic/components/Pagination';
// FIXME: Deal with table after
import { Table, TableBody, TableHeader, TableProps } from '@patternfly/react-table/deprecated';
import { EmptyTable } from '../EmptyTable';
import { TableToolbar } from '../TableToolbar';
import { PrimaryToolbar, PrimaryToolbarProps } from '../PrimaryToolbar';
import { Skeleton } from '../Skeleton';
import { BulkSelectProps } from '../BulkSelect';
import { ConditionalFilterItem } from '../ConditionalFilter';
import { ICell, IRow, TableVariant } from '@patternfly/react-table';
import { SkeletonTable } from '@patternfly/react-component-groups';

export type TableWithFilterPagination = {
  count: number;
  page: number;
  perPage: number;
};

export interface TableWithFilterProps extends Omit<Partial<ModalProps>, 'rows' | 'onSelect' | 'selected' | 'ref'> {
  rows?: IRow[];
  onSelect?: (selected?: IRow[]) => void;
  selected?: IRow[];
  onUpdateData: (pagination: TableWithFilterPagination) => number | undefined;
  pagination: TableWithFilterPagination;
  loaded?: boolean;
  calculateChecked?: (rows: IRow[], selected: IRow[]) => boolean | null;
  unique?: (rows: IRow[]) => IRow[];
  filters?: ConditionalFilterItem[];
  primaryToolbarProps?: PrimaryToolbarProps;
  title?: string;
  systemName?: string;
  columns?: (string | ICell)[];
  tableProps?: Omit<TableProps, 'rows' | 'cells'>;
  entityName?: string;
  bulkSelect?: BulkSelectProps;
}

const TableWithFilter: React.FC<TableWithFilterProps> = ({
  rows = [],
  onSelect,
  selected = [],
  onUpdateData,
  pagination,
  loaded,
  calculateChecked,
  unique,
  filters,
  primaryToolbarProps,
  children,
  title,
  systemName,
  columns = [],
  tableProps,
  entityName = 'tags',
  bulkSelect,
}) => {
  const onRowSelect = ({ isSelected, rowId }: { isSelected?: boolean; rowId: number }) => {
    const currRow = rows?.[rowId];
    if (currRow && onSelect) {
      onSelect(isSelected ? [...selected, currRow] : selected.filter(({ id }) => id !== currRow.id));
    }
  };

  return (
    <Fragment>
      {onUpdateData && (
        <PrimaryToolbar
          {...(onSelect &&
            pagination && {
              bulkSelect: {
                count: selected?.length,
                onSelect: (isSelected: boolean) => {
                  if (isSelected) {
                    onSelect(unique?.([...rows, ...selected]));
                  } else {
                    onSelect(selected.filter(({ id }) => !rows.find(({ id: rowId }) => rowId === id)));
                  }
                },
                checked: loaded && calculateChecked?.(rows, selected),
                items: [
                  {
                    title: 'Select none (0)',
                    onClick: () => onSelect([]),
                  },
                  {
                    ...(loaded && rows?.length > 0
                      ? {
                          title: `Select page (${rows.length})`,
                          onClick: () => onSelect(unique?.([...rows, ...selected])),
                        }
                      : {}),
                  },
                ],
                ...(bulkSelect || {}),
              },
            })}
          {...(filters && {
            filterConfig: {
              items: filters,
            },
          })}
          pagination={
            loaded ? (
              {
                ...(pagination || {}),
                itemCount: pagination?.count,
                onSetPage: (_e, page) => onUpdateData({ ...pagination, page }),
                onPerPageSelect: (_e, perPage) => onUpdateData({ ...pagination, page: 1, perPage }),
              }
            ) : (
              <Skeleton size="lg" />
            )
          }
          {...primaryToolbarProps}
        />
      )}
      {children}
      {loaded ? (
        <Table
          aria-label={title || `${systemName} ${entityName}`}
          variant={TableVariant.compact}
          className="ins-c-tag-modal__table"
          cells={columns}
          rows={
            rows?.length
              ? rows
              : [
                  {
                    cells: [
                      {
                        title: (
                          <EmptyTable>
                            <Bullseye>
                              <EmptyState headingLevel="h5" titleText={`No ${entityName} found`} variant={EmptyStateVariant.full}>
                                <EmptyStateBody>
                                  This filter criteria matches no {entityName}. <br /> Try changing your filter settings.
                                </EmptyStateBody>
                              </EmptyState>
                            </Bullseye>
                          </EmptyTable>
                        ),
                        props: {
                          colSpan: columns.length,
                        },
                      },
                    ],
                  },
                ]
          }
          {...(onSelect &&
            rows?.length && {
              onSelect: (_event, isSelected, rowId) => onRowSelect({ isSelected, rowId }),
            })}
          {...tableProps}
        >
          <TableHeader />
          <TableBody />
        </Table>
      ) : (
        <SkeletonTable columnsCount={columns.length} rows={pagination?.perPage || 10} variant={TableVariant.compact} />
      )}
      {onUpdateData && pagination && loaded && (
        <TableToolbar isFooter className="ins-c-inventory__table--toolbar">
          <Pagination
            itemCount={pagination?.count}
            perPage={pagination?.perPage}
            page={pagination?.page || 0}
            variant="bottom"
            onSetPage={(_event, page) => onUpdateData({ ...pagination, page })}
            onPerPageSelect={(_event, perPage) => onUpdateData({ ...pagination, page: 1, perPage })}
          />
        </TableToolbar>
      )}
    </Fragment>
  );
};

export default TableWithFilter;
