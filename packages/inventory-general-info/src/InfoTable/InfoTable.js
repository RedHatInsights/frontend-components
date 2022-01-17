import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { TextContent, Text, TextVariants, Pagination } from '@patternfly/react-core';
import PrimaryToolbar from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import TableToolbar from '@redhat-cloud-services/frontend-components/TableToolbar';
import { Table, TableHeader, TableBody, TableVariant, SortByDirection } from '@patternfly/react-table';
import flatMap from 'lodash/flatMap';
import { prepareRows, filterRows, generateFilters, onDeleteFilter } from '../constants';
class InfoTable extends Component {
  state = {
    sortBy: { index: 0, direction: SortByDirection.asc },
    opened: [],
    pagination: {
      page: 1,
      perPage: 10,
    },
    activeFilters: {},
  };

  onSort = (event, index, direction) => {
    const { expandable } = this.props;
    this.props.onSort(event, expandable ? index - 1 : index, direction);
    this.setState({
      sortBy: {
        index,
        direction,
      },
    });
  };

  onCollapse = (_event, index, isOpen) => {
    const { opened } = this.state;
    opened[index] = isOpen;
    this.setState({
      opened,
    });
  };

  onUpdatePagination = ({ page, perPage }) => {
    this.setState({ pagination: { ...this.state.pagination, page, perPage } });
  };

  setFilter = (key, value, label) => {
    const { activeFilters } = this.state;
    const { [key]: currFilter, ...restFilter } = activeFilters;
    this.setState({
      activeFilters: {
        ...restFilter,
        ...(value.length !== 0 && {
          [key]: { key, value, label },
        }),
      },
      pagination: { ...this.state.pagination, page: 1 },
    });
  };

  onDeleteFilter = (_e, [deleted], deleteAll) => {
    this.setState({
      activeFilters: onDeleteFilter(deleted, deleteAll, this.state.activeFilters),
      pagination: { ...this.state.pagination, page: 1 },
    });
  };

  render() {
    const { cells, rows, expandable, filters } = this.props;
    const { sortBy, opened, pagination, activeFilters } = this.state;
    const collapsibleProps = expandable ? { onCollapse: this.onCollapse } : {};
    const activeRows = filterRows(rows, activeFilters);
    const mappedRows = expandable
      ? flatMap(prepareRows(activeRows, pagination), ({ child, ...row }, key) => [
          {
            ...row,
            isOpen: opened[key * 2] || false,
          },
          {
            cells: [{ title: child }],
            parent: key * 2,
          },
        ])
      : prepareRows(activeRows, pagination);
    return (
      <Fragment>
        <PrimaryToolbar
          pagination={{
            ...pagination,
            itemCount: activeRows.length,
            onSetPage: (_e, page) => this.onUpdatePagination({ ...pagination, page }),
            onPerPageSelect: (_e, perPage) => this.onUpdatePagination({ ...pagination, page: 1, perPage }),
          }}
          {...(filters && {
            filterConfig: {
              items: generateFilters(cells, filters, activeFilters, this.setFilter),
            },
          })}
          activeFiltersConfig={{
            filters: Object.values(activeFilters).map((filter) => ({
              ...filter,
              category: filter.label,
              chips: Array.isArray(filter.value) ? filter.value.map((item) => ({ name: item })) : [{ name: filter.value }],
            })),
            onDelete: this.onDeleteFilter,
          }}
        />
        {cells.length !== 1 ? (
          <Table
            aria-label="General information dialog table"
            variant={TableVariant.compact}
            cells={cells}
            rows={mappedRows}
            sortBy={{
              ...sortBy,
              index: expandable && sortBy.index === 0 ? 1 : sortBy.index,
            }}
            onSort={this.onSort}
            {...collapsibleProps}
          >
            <TableHeader />
            <TableBody />
          </Table>
        ) : (
          <TextContent>
            {prepareRows(activeRows, pagination).map((row, key) => (
              <Text component={TextVariants.small} key={key}>
                {row.title || row}
              </Text>
            ))}
          </TextContent>
        )}
        <TableToolbar isFooter className="ins-c-inventory__table--toolbar">
          <Pagination
            {...pagination}
            itemCount={activeRows.length}
            variant="bottom"
            onSetPage={(_e, page) => this.onUpdatePagination({ ...pagination, page })}
            onPerPageSelect={(_e, perPage) => this.onUpdatePagination({ ...pagination, page: 1, perPage })}
          />
        </TableToolbar>
      </Fragment>
    );
  }
}

InfoTable.propTypes = {
  rows: PropTypes.array,
  cells: PropTypes.array,
  onSort: PropTypes.func,
  expandable: PropTypes.bool,
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      index: PropTypes.number,
      title: PropTypes.string,
      type: PropTypes.oneOf(['text', 'checkbox', 'radio', 'group']),
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
          label: PropTypes.node,
        })
      ),
    })
  ),
};
InfoTable.defaultProps = {
  cells: [],
  rows: [],
  onSort: () => undefined,
  sortBy: {},
  expandable: false,
};

export default InfoTable;
