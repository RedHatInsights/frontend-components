import React from 'react';
import propTypes from 'prop-types';

import classNames from 'classnames';

import CriticalBattery from './CriticalBattery';
import HighBattery from './HighBattery';
import MediumBattery from './MediumBattery';
import LowBattery from './LowBattery';
import NullBattery from './NullBattery';

import './battery.scss';

/**
 * This is the battery component that generates a 'battery'
 * which corresponds to a level 1-4
 * 1 - low, green - best case scenario
 * 2 - medium, yellow
 * 3 - high, orange
 * 4 - critical, red - worst case scenario
 * Also accepts a label which can be made invisible
 */

const Battery = ({ severity, label, labelHidden, className, ...props }) => {

    let batteryWrapperClasses = classNames(
        className,
        'ins-battery'
    );

    let batteryClasses = classNames(
        { [`ins-battery-${severity}`]: severity !== undefined }
    );

    let ariaLabels = {};
    if (labelHidden) {
        ariaLabels = { ['aria-label']: severity + ' ' + label };
    }

    function generateBattery (severity, batteryClasses, ariaLabels) {
        return (
            <i className= { batteryClasses } { ...ariaLabels }>
                <svg version="1.1"
                    id="battery_svg"
                    x="0px" y="0px"
                    viewBox="0 0 448 512"
                    style={ { enableBackground: 'new 0 0 448 512' } }
                    shapeRendering= 'geometricpresision'>
                    { batteryLevels(severity) }
                </svg>
            </i>
        );
    }

    function batteryLevels (severity) {
        switch (severity) {
            case 'critical':
            case 4:
                return <CriticalBattery/>;
            case 'high':
            case 'error':
            case 3:
                return <HighBattery/>;
            case 'medium':
            case 'warn':
            case 2:
                return <MediumBattery/>;
            case 'low':
            case 'info':
            case 1:
                return <LowBattery/>;
            default:
                // eslint-disable-next-line
                console.error('Warning: Unsupported value presented to battery component');
                return <NullBattery/>;
        }
    }

    if (!labelHidden) {
        return (
            <span className= { batteryWrapperClasses } { ...props } widget-type='InsightsBattery' widget-id={ label }>
                { generateBattery(severity, batteryClasses) }
                <span className='label'> { label } </span>
            </span>
        );
    } else {
        return (
            <span className= { batteryWrapperClasses } { ...props } widget-type='InsightsBattery' widget-id={ label }>
                { generateBattery(severity, batteryClasses, ariaLabels) }
            </span>
        );
    }
};

export default Battery;

Battery.propTypes = {
    severity: propTypes.oneOfType([
        propTypes.string.isRequired,
        propTypes.number.isRequired
    ]),
    label: propTypes.string.isRequired,
    labelHidden: propTypes.bool
};

Battery.defaultProps = {
    severity: 'null'
};

