import React, { Component } from 'react';
import propTypes from 'prop-types';
import { generate } from 'c3';
import { select } from 'd3';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import isEqual from 'lodash/isEqual';

import './donut.scss';

/**
 * Donut used for displaying statuses
 */

const ConditionalLink = ({ condition, wrap, children }) => condition ? wrap(children) : children;

class Donut extends Component {

    componentDidMount () {
        this._updateChart();
    }

    componentDidUpdate(prevProps) {
        if(!isEqual(this.props.values, prevProps.values)) {
            this.donut.load({
                columns: this.props.values
            });
            this.updateLabels(this.donut);
        }
    }

    updateLabels(donut) {
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

        this.donut = generate(donutConfig);

        this.updateLabels(this.donut);
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
                            {/* if this.props.link has a value, wrap the spans in a Link tag */}
                            <ConditionalLink
                                key={oneItem[0]}
                                condition={ this.props.link }
                                wrap={children =>
                                    <Link to={`${this.props.link}${oneItem[0].toLowerCase()}`}>
                                        {children}
                                    </Link>
                                }>
                                <span className="badge"></span>
                                <span className="badge__label">{oneItem[0]}</span>
                                <span className="badge__number">({oneItem[1]})</span>
                            </ConditionalLink>
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

    let text = 'ins-donut-' + new Date().getTime() + Math.random().toString(36).slice(2);

    return text;
}

Donut.propTypes = {
    className: propTypes.string,
    height: propTypes.number,
    identifier: propTypes.string,
    values: propTypes.array.isRequired,
    width: propTypes.number,
    totalLabel: propTypes.string,
    withLegend: propTypes.bool,
    link: propTypes.string
};

Donut.defaultProps = {
    withLegend: false,
    height: 200,
    identifier: generateId(),
    width: 200
};
