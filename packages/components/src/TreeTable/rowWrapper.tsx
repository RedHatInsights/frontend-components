import React from 'react';
import { RowWrapper } from '@patternfly/react-table';
import classnames from 'classnames';

import { TreeTableRow } from './helpers';

export interface TreeRowWrapperProps {
  className?: string;
  row?: TreeTableRow;
  rows?: TreeTableRow[];
}

const TreeRowWrapper: React.FunctionComponent<TreeRowWrapperProps> = (props) => {
  const { className } = props;
  const { level, isTreeOpen, point, posinset } = props.row || {};
  return (
    <RowWrapper
      {...props}
      aria-level={level === undefined ? 1 : level + 1}
      aria-posinset={posinset}
      aria-setsize={point ? point.size : 0}
      className={classnames({
        className,
        'pf-m-expandable': isTreeOpen === true || isTreeOpen === false,
        'pf-m-expanded': isTreeOpen === true,
      })}
    />
  );
};

export default TreeRowWrapper;
