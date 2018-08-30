import React, { Component } from 'react';
import propTypes from 'prop-types';
import * as c3 from 'c3';
// import * as d3 from 'd3';
import { select } from 'd3';
import classNames from 'classnames';

import './donut.scss';

/**
 * Donut used for displaying statuses
 */

class Donut extends Component {

    componentDidMount () {
        this._updateChart();
    }

    _updateChart () {
        let data = {
            type: 'donut',
            columns: this.props.values,
            donut: {
                title: 'Donut'
            }
        };

        let donutConfig = {
            bindto: '#' + this.props.identifier,
            data,
            size: {
                width: this.props.width,
                height: this.props.height
            },
            legend: {
                show: false
            },
            donut: {
                width: 8,
                label: {
                    show: false
                }
            }
        };

        let donut = c3.generate(donutConfig);

        /* eslint-disable */
        if (this.props.withLegend) {

            select(this.legend)
                .selectAll('div.ins-l-donut__legend--item')
                .each(function() {
                    select(this)
                        .select('span').style('background-color', donut.color(this.getAttribute('data-id')));
                    })
                    .on('mouseover', function () {
                        donut.focus(this.getAttribute('data-id'));
                    })
                    .on('mouseout', function () {
                        donut.revert();
                    })
        }
        /* eslint-enable */
    }

    render () {

        const donutClasses = classNames(
            this.props.className,
            'ins-c-donut'
        );

        let total = 0;
        for (let i = 0; i < this.props.values.length; i++) {
            total += this.props.values[i][1];
        }

        let donutLegend;
        if (this.props.withLegend) {
            donutLegend =
            <div className='ins-l-donut__legend' ref={ref => {this.legend = ref;}}>
                {this.props.values && this.props.values.map(oneItem => (
                    <div key={oneItem}  data-id={oneItem[0]} className="donut ins-l-donut__legend--item">
                        <div className="badge-wrapper">
                            <span className="badge"></span>
                            <span className="badge__label">{oneItem[0]}</span>
                            <span className="badge__number">({oneItem[1]})</span>
                        </div>
                    </div>
                ))}
            </div>;
        }

        return (
            <React.Fragment>
                <div className='ins-l-donut'>
                    <div id={this.props.identifier} className={donutClasses}></div>
                    <div className='ins-c-donut-hole'>
                        <span className='ins-c-donut-hole--total__number'>{total}</span>
                        <span className='ins-c-donut-hole--total__label'>{this.props.totalLabel}</span>
                    </div>
                </div>
                {donutLegend}
            </React.Fragment>
        );
    }
}

export default Donut;

/**
 * generate random ID if one is not supplied
 */
function generateId () {

    let text = new Date().getTime() + Math.random().toString(36).slice(2);

    return text;
}

Donut.propTypes = {
    className: propTypes.string,
    height: propTypes.number,
    identifier: propTypes.string,
    values: propTypes.array,
    width: propTypes.number,
    totalLabel: propTypes.string,
    withLegend: propTypes.bool
};

Donut.defaultProps = {
    withLegend: false,
    height: 200,
    identifier: generateId(),
    width: 200
};
