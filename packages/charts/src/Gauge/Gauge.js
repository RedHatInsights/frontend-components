import React, { Component } from 'react';
import propTypes from 'prop-types';
import { generate } from 'c3';
import classNames from 'classnames';

import './gauge.scss';

/**
 * Gauge used for displaying statuses
 */

class Gauge extends Component {
  componentDidMount() {
    this._updateChart();
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      this.gauge.load({
        columns: [[this.props.label, this.props.value]],
      });
    }
  }

  _updateChart() {
    let data = {
      type: 'gauge',
      columns: [[this.props.label, this.props.value]],
    };

    let gaugeConfig = {
      bindto: '#' + this.props.identifier,
      data,
      size: {
        width: this.props.width,
        height: this.props.height,
      },
      legend: {
        show: false,
      },
      gauge: {
        fullCircle: true,
        label: {
          // hides value in center of gauge
          format() {
            return;
          },
          // hides min/max values of gauge
          show: false,
        },
        width: 4,
        startingAngle: 2 * Math.PI,
      },
      // this just makes it so that we can add custom threshold colors. It does not
      // actually control the thresholds or the colors. It's more of a flag for us
      color: {
        threshold: {
          values: [25, 50, 75, 100],
        },
      },
      tooltip: {
        show: false,
      },
    };

    this.gauge = generate(gaugeConfig);
  }

  render() {
    // this sets the color of the arc based on the value of props.value
    const threshold = 25;
    let colors = {
      0: 'ins-m-fill-level-4',
      1: 'ins-m-fill-level-3',
      2: 'ins-m-fill-level-2',
      3: 'ins-m-fill-level-1',
      4: 'ins-m-fill-level-1',
    };

    const gaugeClasses = classNames(
      this.props.className,
      this.props.flipFullColors ? 'ins-m-negative' : '',
      'ins-c-gauge',
      colors[Math.floor(this.props.value / threshold)]
    );

    return <div id={this.props.identifier} className={gaugeClasses} widget-type="InsightsGauge" widget-id={this.props.identifier}></div>;
  }
}

export default Gauge;

Gauge.propTypes = {
  className: propTypes.string,
  height: propTypes.number,
  identifier: propTypes.string,
  label: propTypes.string.isRequired,
  value: propTypes.number.isRequired,
  width: propTypes.number,
  flipFullColors: propTypes.bool,
};

Gauge.defaultProps = {
  height: 200,
  identifier: 'ins-chart-gauge',
  width: 200,
  flipFullColors: false,
};
