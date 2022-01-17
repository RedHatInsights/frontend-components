import React from 'react';
import PropTypes from 'prop-types';
import { RowWrapper } from '@patternfly/react-table';
import classnames from 'classnames';

const TreeRowWrapper = (props) => {
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

TreeRowWrapper.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      level: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      isTreeOpen: PropTypes.bool,
      point: PropTypes.shape({
        size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
      posinset: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  className: PropTypes.string,
  row: PropTypes.object,
};

export default TreeRowWrapper;
