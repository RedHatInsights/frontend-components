import React from 'react';
import PropTypes from 'prop-types';
import { ConfigProp, CellDataProp } from './Props';
import { select } from 'd3';

class NodeElement extends React.Component {
  constructor(props) {
    super(props);
    this.animateSize = this.animateSize.bind(this);
  }

  animateSize() {
    const { cellData } = this.props;
    const limitedLength = cellData.length < 3 ? cellData.length : 3;
    const graphicSize = limitedLength * 7;
    const ref = select(this.ref);
    ref.transition().attr('r', graphicSize).duration(400);
  }

  componentDidMount() {
    this.animateSize();
  }

  componentDidUpdate() {
    this.animateSize();
  }

  render() {
    const {
      config: { size = 540, gridSize = size - 110, max = 10, min = 0 },
      onClick,
      rowCoord,
      cellCoord,
      color,
      cellData,
      ...props
    } = this.props;
    const tick = gridSize / (max - min);
    const limitedLength = cellData.length < 3 ? cellData.length : 3;
    return (
      <g {...props} onClick={() => onClick(cellData, color)}>
        <circle ref={(ref) => (this.ref = ref)} cx={tick * cellCoord + 23} cy={tick * rowCoord + 23} fill={color} r={7} />
        <text
          fill="black"
          textAnchor="middle"
          fontSize={13 + limitedLength + 'px'}
          x={tick * cellCoord + 23}
          y={tick * rowCoord + 26 + limitedLength}
        >
          {cellData.length < 3 ? cellData.length : '3+'}
        </text>
      </g>
    );
  }
}

NodeElement.propTypes = {
  config: ConfigProp,
  onClick: PropTypes.func,
  rowCoord: PropTypes.number,
  cellCoord: PropTypes.number,
  color: PropTypes.string,
  cellData: CellDataProp,
};

export default NodeElement;
