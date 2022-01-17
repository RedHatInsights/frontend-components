import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Segment = ({ coords: [X, Y], className, size, color, children, ...props }) => (
  <svg className={classNames('axis-grid', className)} x={X} y={Y}>
    <rect {...props} width={size} height={size} fill={color} />
    {children}
  </svg>
);

Segment.propTypes = {
  size: PropTypes.number.isRequired,
  className: PropTypes.string,
  coords: PropTypes.arrayOf(PropTypes.number).isRequired,
  color: PropTypes.string,
  children: PropTypes.node,
};

Segment.defaultProps = {
  color: 'none',
  className: null,
  children: null,
};

export default Segment;
