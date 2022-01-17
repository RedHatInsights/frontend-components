import React from 'react';
import PropTypes from 'prop-types';

const Axis = ({ pad, shift, size, children, ...props }) => (
  <g className="axis-grid" transform={`translate(${shift},0)`}>
    <line x1={pad} y1={size / 2} x2={size - pad} y2={size / 2} strokeWidth="0.3" stroke="black" {...props} />
    <line x1={size / 2} y1={pad} x2={size / 2} y2={size - pad} strokeWidth="0.3" stroke="black" {...props} />
    <rect strokeWidth="0.3" stroke="black" width={size} height={size} fill="none" {...props} />
    {children}
  </g>
);

Axis.propTypes = {
  pad: PropTypes.number,
  shift: PropTypes.number,
  size: PropTypes.number.isRequired,
  children: PropTypes.node,
};

Axis.defaultProps = {
  pad: 0,
  shift: 0,
  children: null,
};

export default Axis;
