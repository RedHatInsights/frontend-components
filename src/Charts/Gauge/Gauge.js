import React, { Component } from 'react';
import propTypes from 'prop-types';
import * as c3 from 'c3';
import classNames from 'classnames';

import './gauge.scss';

/**
 * Gauge used for displaying statuses
 */

class Gauge extends Component {

    componentDidMount () {
        this._updateChart();
    }    

    _updateChart () {
        let data = {
            type : 'gauge',
            columns: [
                [this.props.label, this.props.value]
            ]
        };

        let gaugeConfig = {
            bindto: '#' + this.props.identifier,
            data: data,
            size: {
                width: this.props.width,
                height: this.props.height
            },
            legend: {
                show: false
            },
            gauge: {
                fullCircle: true,
                label: {
                    // hides value in center of gauge
                    format: function () {
                        return;
                    },
                    // hides min/max values of gauge
                    show: false
                },
                width: 8,
                startingAngle: 2*Math.PI
            },
            // this just makes it so that we can add custom threshold colors. It does not
            // actually control the thresholds or the colors. It's more of a flag for us
            color: {
                threshold: {
                    values: [25, 50, 75, 100]
                }
            }
        };

        let gauge = c3.generate(gaugeConfig);
    }

    render () {
        // this sets the color of the arc based on the value of props.value
        const threshold = 25;
        let colors = {
            0: 'ins-c-arc__critical', 
            1: 'ins-c-arc__high',
            2: 'ins-c-arc__medium',
            3: 'ins-c-arc__low',
            4: 'ins-c-arc__low'
        };

        const gaugeClasses = classNames(
            this.props.className,
            'ins-c-gauge',
            colors[Math.floor(this.props.value / threshold)]
        );

        return (
            <div id={this.props.identifier} className={gaugeClasses}></div>
        );
    }
}

export default Gauge;

/**
 * generate random ID if one is not supplied
 */
function generateId () {
     let text = new Date().getTime() + Math.random().toString(36).slice(2);
     return text;
}

Gauge.propTypes = {
    className: propTypes.string,
    height: propTypes.number,
    identifier: propTypes.string,
    label: propTypes.string,
    value: propTypes.number,
    width: propTypes.number
};

Gauge.defaultProps = {
    height: 200,
    identifier: generateId(),
    width: 200
};
