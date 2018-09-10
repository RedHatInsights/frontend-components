import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const TableFooter = ({
  children,
  className,
  expandable,
  hasCheckbox,
  hasIcon,
  onSort,
  onItemSelect,
  colspan = 0,
  ...props
}) => {
  colspan = hasCheckbox ? colspan + 1 : colspan;
  colspan = hasIcon? colspan + 1 : colspan;
  colspan = expandable? colspan + 1: colspan;
  return (
    <tfoot {...props} className={classnames('ins-table-footer', className)}>
      <tr>
        <td colSpan={colspan}>{children}</td>
      </tr>
    </tfoot>
  );
};

TableFooter.propTypes = {
  expandable: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  hasCheckbox: PropTypes.bool,
  hasIcon: PropTypes.bool,
  colspan: PropTypes.number
}

export default TableFooter;
