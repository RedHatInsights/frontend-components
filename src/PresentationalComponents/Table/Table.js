import React from 'react';
import PropTypes from 'prop-types';
import THead from './TableHeader';
import TBody from './TableBody';
import TFooter from './TableFooter';
import classnames from 'classnames';

export const TableVariant = {
  large: 'large'
}

export const SortDirection = {
  up: 'up',
  down: 'down'
}

const Table = ({
  hasCheckbox,
  sortBy = {},
  className,
  rows,
  header,
  footer,
  onSort,
  hasIcon,
  onRowClick,
  onColClick,
  onItemSelect,
  expandable,
  onExpandClick,
  ...props
}) => {
  const onAllRowsSelect = (event, selected) => {
    Object.keys(rows).forEach((oneRow, key) => {
      onItemSelect(event, oneRow.hasOwnProperty('id') ? oneRow.id : key, selected);
    });
  }

  return (
    <table
      {...props}
      className={
        classnames(
          'pf-c-table',
          props.variant !== TableVariant.large && 'pf-m-compact',
          className
        )
      }
    >
      <caption className="pf-c-table__caption">
      </caption>
      {header &&
        <THead
          expandable={expandable}
          onSelectAll={onAllRowsSelect}
          hasIcon={hasIcon}
          hasCheckbox={hasCheckbox}
          sortBy={sortBy}
          cols={header}
          onSort={onSort}
        />
      }
      {rows &&
        <TBody
          onExpandClick={onExpandClick}
          cols={header}
          expandable={expandable}
          hasCheckbox={hasCheckbox}
          rows={rows}
          onItemSelect={onItemSelect}
          onRowClick={onRowClick}
          onColClick={onColClick}
        />
      }
      {footer && <TFooter hasCheckbox={hasCheckbox} expandable={expandable} hasIcon={hasIcon} children={footer} colspan={header.length}/>}
    </table>
  )
}

Table.propTypes = {
  expandable: PropTypes.bool,
  hasCheckbox: PropTypes.bool,
  variant: PropTypes.oneOf(Object.keys(TableVariant)),
  hasIcon: PropTypes.bool,
  sortBy: PropTypes.shape({
    index: PropTypes.string,
    direction: PropTypes.oneOf(Object.keys(SortDirection))
  }),
  className: PropTypes.string,
  rows: PropTypes.any,
  header: PropTypes.any,
  footer: PropTypes.node,
  onSort: PropTypes.func,
  onItemSelect: PropTypes.func,
  onColClick: PropTypes.func,
  onRowClick: PropTypes.func,
  onExpandClick: PropTypes.func
}

Table.defaulProps = {
  hasCheckbox: false,
  expandable: false,
  onItemSelect: () => undefined,
  onColClick: () => undefined,
  onRowClick: () => undefined
}

export default Table;
