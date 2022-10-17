import React, { Component } from 'react';
import './tagModal.scss';
import { Button, Modal, Tab, TabTitleText, Tabs } from '@patternfly/react-core';
import classNames from 'classnames';
import TableWithFilter, { TableWithFilterPagination, TableWithFilterProps } from './TableWithFilter';
import { ICell, IRow } from '@patternfly/react-table';
import { ConditionalFilterItem } from '../ConditionalFilter';
import { BulkSelectProps } from '../BulkSelect';

export type OnSelectRow = (selected?: IRow[]) => void;
export type OnUpdateData = (pagination: TableWithFilterPagination) => number | undefined;

export interface TagModalProps
  extends Omit<TableWithFilterProps, 'onSelect' | 'columns' | 'pagination' | 'loaded' | 'filters' | 'onUpdateData' | 'bulkSelect'> {
  title: string;
  systemName?: string;
  className?: string;
  toggleModal: (e?: React.MouseEventHandler<HTMLButtonElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>, open?: boolean) => void;
  isOpen: boolean;
  tabNames?: string[];
  onApply?: (...args: unknown[]) => void;
  rows: IRow[] | IRow[][];
  columns: (string | ICell)[] | (string | ICell)[][];
  pagination: TableWithFilterPagination | TableWithFilterPagination[];
  loaded: boolean | boolean[];
  filters?: ConditionalFilterItem[][] | ConditionalFilterItem[];
  selected?: IRow[] | IRow[][];
  onSelect?: OnSelectRow | OnSelectRow[];
  onUpdateData?: OnUpdateData | OnUpdateData[];
  bulkSelect?: BulkSelectProps | BulkSelectProps[];
}

const calculateChecked = (rows: IRow[] = [], selected: IRow[]) =>
  rows.every(({ id }) => selected && selected.find(({ id: selectedId }) => selectedId === id))
    ? rows.length > 0
    : rows.some(({ id }) => selected && selected.find(({ id: selectedId }) => selectedId === id)) && null;

const unique = (arr: IRow[]) => arr.filter(({ id }, index, arr) => arr.findIndex(({ id: currId }) => currId === id) === index);

class TagModal extends Component<TagModalProps> {
  state = {
    selectedTab: 0,
    activeTabKey: undefined,
  };

  handleTabClick = (_event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: string | number) => {
    this.setState({ activeTabKey: tabIndex });
  };

  renderTable = (
    rows: IRow[],
    columns: (string | ICell)[],
    pagination: TableWithFilterPagination,
    loaded: boolean,
    filters: ConditionalFilterItem[],
    selected: IRow[],
    onSelect?: (selected?: IRow[] | undefined) => void,
    onUpdateData: (pagination: TableWithFilterPagination) => number | undefined = () => undefined,
    bulkSelect?: BulkSelectProps
  ) => (
    <TableWithFilter
      {...this.props}
      rows={rows}
      pagination={pagination}
      loaded={loaded}
      calculateChecked={calculateChecked}
      unique={unique}
      filters={filters}
      title={this.props.title}
      systemName={this.props.systemName}
      columns={columns}
      onSelect={onSelect}
      onUpdateData={onUpdateData}
      selected={selected}
      bulkSelect={bulkSelect}
    >
      {this.props.children}
    </TableWithFilter>
  );

  render() {
    const {
      className,
      title,
      systemName,
      toggleModal = () => undefined,
      isOpen = false,
      rows = [],
      columns = [{ title: 'Name' }, { title: 'Tag source' }],
      children,
      pagination = { count: 10 },
      loaded = false,
      filters,
      onApply,
      tabNames,
      onSelect,
      onUpdateData = () => undefined,
      selected,
      tableProps = {},
      bulkSelect,
      ...props
    } = this.props;

    const isTabbed = Array.isArray(tabNames);

    return (
      <Modal
        {...props}
        className={classNames('ins-c-tag-modal', className)}
        isOpen={isOpen}
        title={title || `Tags for ${systemName}`}
        onClose={() => toggleModal(undefined, false)}
        variant="medium"
        {...(onApply && {
          actions: [
            <Button
              key="confirm"
              variant="primary"
              isDisabled={
                isTabbed ? Object.values(selected || {}).every((values) => !values || values?.length === 0) : !selected || selected?.length === 0
              }
              onClick={(e) => {
                onApply();
                toggleModal(e, true);
              }}
            >
              Apply {isTabbed ? 'selected' : 'tags'}
            </Button>,
            <Button key="cancel" variant="link" onClick={(e) => toggleModal(e, false)}>
              Cancel
            </Button>,
          ],
        })}
      >
        {isTabbed ? (
          <Tabs activeKey={this.state.activeTabKey} onSelect={this.handleTabClick}>
            {tabNames.map((item, key) => (
              <Tab key={key} eventKey={key} title={<TabTitleText>All {item}</TabTitleText>}>
                {this.renderTable(
                  rows?.[key] as IRow[],
                  columns?.[key] as ICell[],
                  (pagination as TableWithFilterPagination[])?.[key],
                  (loaded as boolean[])?.[key],
                  (filters as ConditionalFilterItem[][])?.[key],
                  (selected as IRow[][])?.[key],
                  (onSelect as unknown as ((selected?: IRow[]) => void)[])?.[key],
                  (onUpdateData as unknown as ((pagination: TableWithFilterPagination) => number)[])?.[key],
                  (bulkSelect as BulkSelectProps[])?.[key]
                )}
              </Tab>
            ))}
          </Tabs>
        ) : (
          this.renderTable(
            rows,
            columns as ICell[],
            pagination as TableWithFilterPagination,
            loaded as boolean,
            filters as ConditionalFilterItem[],
            selected as IRow[],
            onSelect as TableWithFilterProps['onSelect'],
            onUpdateData as TableWithFilterProps['onUpdateData'],
            bulkSelect as BulkSelectProps
          )
        )}
      </Modal>
    );
  }
}

export default TagModal;
