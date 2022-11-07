import React, { Fragment } from 'react';
import { Toolbar, ToolbarProps, useOUIAId } from '@patternfly/react-core';
import classNames from 'classnames';

import './TableToolbar.scss';

export interface TableToolbarProps extends Omit<Omit<ToolbarProps, 'selected'>, 'ref'> {
  isFooter?: boolean;
  results?: number;
  className?: string;
  selected?: number;
  ouiaId?: string;
  ouiaSafe?: boolean;
}

function generateCount(results: number) {
  if (results > 1 || results < 1) {
    return `${results} Results`;
  } else {
    return `${results} Result`;
  }
}

const TableToolbar: React.FunctionComponent<TableToolbarProps> = ({
  isFooter = false,
  results,
  className,
  selected,
  children,
  ouiaId,
  ouiaSafe = true,
  ...props
}) => {
  const tableToolbarClasses = classNames('ins-c-table__toolbar', { [`ins-m-footer`]: isFooter }, className);
  const ouiaComponentType = 'RHI/TableToolbar';
  const ouiaFinalId = useOUIAId(ouiaComponentType, ouiaId, ouiaSafe as unknown as string);

  return (
    <Fragment>
      <Toolbar
        className={tableToolbarClasses}
        data-ouia-component-type={ouiaComponentType}
        data-ouia-component-id={ouiaFinalId}
        data-ouia-safe={ouiaSafe}
        {...props}
      >
        {children}
      </Toolbar>
      {((results && results >= 0) || (selected && selected >= 0)) && (
        <div className="ins-c-table__toolbar-results">
          {results && results >= 0 && <span className="ins-c-table__toolbar-results-count"> {generateCount(results)} </span>}
          {selected && selected >= 0 && <span className="ins-c-table__toolbar-results-selected"> {selected} Selected </span>}
        </div>
      )}
    </Fragment>
  );
};

export default TableToolbar;
