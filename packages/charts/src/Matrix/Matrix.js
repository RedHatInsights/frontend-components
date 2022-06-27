import React, { Component } from 'react';
import propTypes from 'prop-types';
import { ConfigDefaults, ConfigProp, DataProps, LabelsDefaults, LabelsProp } from './Props';
import { event, select } from 'd3';
import classnames from 'classnames';
import Axis from './Axis';
import Segment from './Segment';
import Tooltip from './Tooltip';
import Labels from './Labels';
import NodeElement from './NodeElement';
import './matrix.scss';

import { calculateFragements, callOnSegmentData } from './utils';

class Matrix extends Component {
  static getDerivedStateFromProps(props, state) {
    const { data } = props;
    const { config } = props;
    if (data !== undefined) {
      return {
        ...state,
        ...calculateFragements(data, config),
      };
    }

    return null;
  }

  constructor(props) {
    super(props);
    this.matrixChart = this.matrixChart.bind(this);
    this.onDocClick = this.onDocClick.bind(this);
    this.onNodeClick = this.onNodeClick.bind(this);
    this.state = {
      data: {},
      activeNode: {},
    };
  }

  componentWillUnmount() {
    document && document.removeEventListener('mousedown', this.onDocClick);
  }

  componentDidMount() {
    document && document.addEventListener('mousedown', this.onDocClick);
    this.matrixChart();
  }

  onDocClick(event) {
    if (this.ref && !this.ref.contains(event.target)) {
      select(this.ref).selectAll('svg.axis-grid g circle').attr('stroke', 'none');
      this.setState({ activeNode: {} });
    }
  }

  componentDidUpdate() {
    this.matrixChart();
  }

  matrixChart() {
    const ref = select(this.ref);
    const tooltip = select(this.tooltip);
    ref.selectAll('svg.axis-grid g').on('click', function () {
      ref.selectAll('svg.axis-grid g circle').attr('stroke', 'none');
      select(event.currentTarget).select('circle').attr('stroke', 'black').attr('stroke-width', 2);
      tooltip.style('left', event.x + 'px').style('top', event.y - 28 + 'px');
    });
  }

  onNodeClick(cellData, color) {
    this.setState({ activeNode: { color, cellData } });
  }

  render() {
    const { data, activeNode } = this.state;
    const {
      config: { size = 540, gridSize = size - 110, pad, shift },
      labels,
    } = this.props;
    return (
      <div identifier={this.props.identifier} className="ins-matrix-chart" widget-type="InsightsMatrix" widget-id={this.props.identifier}>
        <svg width={size} height={size} ref={(ref) => (this.ref = ref)}>
          <Axis size={gridSize} pad={pad} shift={shift}>
            {Object.values(data).map((oneSegment, key) => (
              <Segment key={key} size={gridSize / 2} coords={oneSegment.coords}>
                {callOnSegmentData(oneSegment.rows, (_rows, rowKey, cell, cellKey) => (
                  <NodeElement
                    key={`${rowKey}-${cellKey}`}
                    config={this.props.config}
                    color={oneSegment.color}
                    cellData={cell}
                    rowCoord={rowKey}
                    cellCoord={cellKey}
                    onClick={this.onNodeClick}
                  />
                ))}
              </Segment>
            ))}
          </Axis>
          <Labels size={gridSize} values={labels} />
        </svg>
        <div
          className={classnames({
            tooltip: true,
            active: activeNode && activeNode.cellData && activeNode.cellData.length !== 0,
          })}
          ref={(ref) => (this.tooltip = ref)}
        >
          {activeNode && activeNode.cellData && <Tooltip color={activeNode.color} cellData={activeNode.cellData} />}
        </div>
      </div>
    );
  }
}

Matrix.propTypes = {
  data: DataProps.isRequired,
  config: ConfigProp,
  labels: LabelsProp,
  identifier: propTypes.string,
};

Matrix.defaultProps = {
  config: ConfigDefaults,
  labels: LabelsDefaults,
  identifier: 'ins-chart-matrix',
};

export default Matrix;
