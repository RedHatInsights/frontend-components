import React from 'react';
import PropTypes from 'prop-types';
import { LabelsProp } from './Props';
const Labels = ({
  color,
  values: {
    xLabel,
    yLabel,
    subLabels: {
      xLabels: [xLeft, xRight],
      yLabels: [yBottom, yTop],
    },
  },
  size,
  ...props
}) => {
  return (
    <g className="axis-labels">
      <text {...props} fill={color} textAnchor="middle" x={size / 4} y={size + 20}>
        {xLeft}
      </text>
      <text {...props} fill={color} textAnchor="middle" x={(size / 4) * 3} y={size + 20}>
        {xRight}
      </text>
      <text {...props} fill={color} textAnchor="middle" x={size / 2 + 8} y={size + 35} className="headline">
        {xLabel}
      </text>
      <text {...props} fill={color} textAnchor="middle" x="-10" y={size / 4}>
        {yTop}
      </text>
      <text {...props} fill={color} textAnchor="middle" x="-10" y={(size / 4) * 3}>
        {yBottom}
      </text>
      <text {...props} fill={color} textAnchor="middle" x="-20" y={size / 2 + 6} className="headline">
        {yLabel}
      </text>
    </g>
  );
};

Labels.propTypes = {
  size: PropTypes.number.isRequired,
  values: LabelsProp,
  color: PropTypes.string,
  children: PropTypes.node,
};

Labels.defaultProps = {
  children: null,
  color: '#414241',
};

export default Labels;
