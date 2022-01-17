import React from 'react';
import propTypes from 'prop-types';

import classNames from 'classnames';

import './EmptyTable.scss';

const EmptyTable = ({ centered, className, children, ...props }) => {
  const emptyTableClasses = classNames('ins-c-table__empty', { [`is-centered`]: centered }, className);

  return (
    <div className={emptyTableClasses} {...props}>
      {' '}
      {children}
    </div>
  );
};

export default EmptyTable;

EmptyTable.propTypes = {
  centered: propTypes.bool,
  children: propTypes.any,
  className: propTypes.string,
};
