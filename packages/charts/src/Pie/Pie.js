import React, { Component } from 'react';
import propTypes from 'prop-types';
import { generate } from 'c3';
import { select } from 'd3';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import isEqual from 'lodash/isEqual';

import './pie.scss';
import { LegendPosition } from '../Donut/Donut.js';

/**
 * Pie used for displaying statuses
 */

const ConditionalLink = ({ condition, wrap, children }) => (condition ? wrap(children) : children);

class Pie extends Component {
  componentDidMount() {
    this._updateChart();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.values, prevProps.values)) {
      this.pie.load({
        columns: this.props.values,
      });
      this.updateLabels(this.pie);
    }
  }

  updateLabels(pie) {
    if (this.props.withLegend) {
      select(this.legend)
        .selectAll('div.ins-l-pie__legend--item')
        .each(function () {
          select(this)
            .select('span')
            .style('background-color', pie.color(this.getAttribute('data-id')));
        })
        .on('mouseover', function () {
          pie.focus(this.getAttribute('data-id'));
        })
        .on('mouseout', function () {
          pie.revert();
        });
    }
  }

  _updateChart() {
    let data = {
      type: 'pie',
      columns: this.props.values,
    };

    let pieConfig = {
      bindto: '#' + this.props.identifier,
      data,
      size: {
        width: this.props.width,
        height: this.props.height,
      },
      legend: {
        show: false,
      },
      pie: {
        width: 8,
        label: {
          show: false,
        },
      },
    };

    this.pie = generate(pieConfig);

    this.updateLabels(this.pie);
  }

  render() {
    const pieClasses = classNames(this.props.className, 'ins-c-pie');

    const wrapperClasses = classNames({
      'ins-l-pie-wrapper': true,
      'legend-right': this.props.legendPosition === LegendPosition.right,
      'legend-top': this.props.legendPosition === LegendPosition.top,
      'legend-left': this.props.legendPosition === LegendPosition.left,
      'legend-bottom': this.props.legendPosition === LegendPosition.bottom,
    });

    let pieLegend;
    if (this.props.withLegend) {
      pieLegend = (
        <div
          className="ins-l-pie__legend"
          ref={(ref) => {
            this.legend = ref;
          }}
        >
          {this.props.values &&
            this.props.values.map((oneItem) => (
              <div key={oneItem} data-id={oneItem[0]} className="pie ins-l-pie__legend--item">
                <div className="badge-wrapper">
                  {/* if this.props.link has a value, wrap the spans in a Link tag */}
                  <ConditionalLink
                    key={oneItem[0]}
                    condition={this.props.link}
                    wrap={(children) => <Link to={`${this.props.link}${oneItem[0].toLowerCase()}`}>{children}</Link>}
                  >
                    <span className="badge"></span>
                    <span className="badge__label">{oneItem[0]}</span>
                    <span className="badge__number">({oneItem[1]})</span>
                  </ConditionalLink>
                </div>
              </div>
            ))}
        </div>
      );
    }

    return (
      <div className={wrapperClasses} widget-type="InsightsPie" widget-id={this.props.identifier}>
        <div className="ins-l-pie">
          <div id={this.props.identifier} className={pieClasses}></div>
        </div>
        {pieLegend}
      </div>
    );
  }
}

export default Pie;

Pie.propTypes = {
  className: propTypes.string,
  height: propTypes.number,
  identifier: propTypes.string,
  values: propTypes.array.isRequired,
  width: propTypes.number,
  withLegend: propTypes.bool,
  link: propTypes.string,
  legendPosition: propTypes.oneOf(Object.keys(LegendPosition)),
};

Pie.defaultProps = {
  withLegend: false,
  height: 200,
  identifier: 'ins-chart-pie',
  width: 200,
  legendPosition: 'bottom',
};
