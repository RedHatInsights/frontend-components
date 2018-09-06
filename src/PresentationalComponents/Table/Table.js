import React from 'react';
import PropTypes from 'prop-types';
import THead from './TableHeader';
import TBody from './TableBody';
import TFooter from './TableFooter';
import classnames from 'classnames';

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
  ...props
}) => {
  const onAllRowsSelect = (event, selected) => {
    Object.keys(rows).forEach((oneRow, key) => {
      onItemSelect(event, oneRow.hasOwnProperty('id') ? oneRow.id : key, selected);
    });
  }

  return (
    <table {...props} className={classnames('pf-c-table', className)}>
      <caption className="pf-c-table__caption">
      </caption>
      {header &&
        <THead
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
          cols={header}
          hasCheckbox={hasCheckbox}
          rows={rows}
          onItemSelect={onItemSelect}
          onRowClick={onRowClick}
          onColClick={onColClick}
        />
      }
      {footer && <TFooter hasCheckbox={hasCheckbox} hasIcon={hasIcon} children={footer} colspan={header.length}/>}
    </table>
  )
}

Table.propTypes = {
  hasCheckbox: PropTypes.bool,
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
}

Table.defaulProps = {
  hasCheckbox: false,
  onItemSelect: () => undefined,
  onColClick: () => undefined,
  onRowClick: () => undefined
}

export default Table;
