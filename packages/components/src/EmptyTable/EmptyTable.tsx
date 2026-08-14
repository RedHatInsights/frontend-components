import React from 'react';

import classNames from 'classnames';

import './EmptyTable.scss';

export interface EmptyTableProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  centered?: boolean;
  className?: string;
}

const EmptyTable = ({ centered, className, children, ...props }: EmptyTableProps) => {
  const emptyTableClasses = classNames('ins-c-table__empty', { [`is-centered`]: centered }, className);

  return (
    <div className={emptyTableClasses} {...props}>
      {' '}
      {children}
    </div>
  );
};

export default EmptyTable;
