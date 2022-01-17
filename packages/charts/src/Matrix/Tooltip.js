import React from 'react';
import PropTypes from 'prop-types';
import { CellDataProp } from './Props';

const Tooltip = ({ color, cellData }) => (
  <React.Fragment>
    {cellData.map((item, key) => (
      <div key={key}>
        <span className="tooltip-box" style={{ background: color }}></span>
        {item.label}
      </div>
    ))}
  </React.Fragment>
);

Tooltip.propTypes = {
  color: PropTypes.string,
  cellData: CellDataProp,
};

Tooltip.defaultProps = {
  color: 'black',
};

export default Tooltip;
