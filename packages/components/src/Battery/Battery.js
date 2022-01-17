/* eslint max-len: 0 */
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
  let batteryClasses = classNames(className, 'ins-battery', { [`ins-battery-${severity}`]: severity !== undefined });

  let ariaLabels = {};
  if (labelHidden) {
    ariaLabels = { ['aria-label']: severity + ' ' + label };
  }

  function batteryLevels(severity) {
    switch (severity) {
      case 'critical':
      case 4:
        return <CriticalBattery />;
      case 'high':
      case 'error':
      case 3:
        return <HighBattery />;
      case 'medium':
      case 'warn':
      case 2:
        return <MediumBattery />;
      case 'low':
      case 'info':
      case 1:
        return <LowBattery />;
      default:
        // eslint-disable-next-line
                console.error('Warning: Unsupported value presented to battery component');
        return <NullBattery />;
    }
  }

  return (
    <React.Fragment>
      <i className={batteryClasses} {...ariaLabels} {...props} widget-type="InsightsBattery" widget-id={label}>
        <svg
          version="1.1"
          id="battery_svg"
          x="0px"
          y="0px"
          viewBox="0 0 448 512"
          style={{ enableBackground: 'new 0 0 448 512' }}
          shapeRendering="geometricpresision"
        >
          <path
            style={{
              fill: 'none',
              fillOpacity: 1,
              stroke: '#969696',
              strokeWidth: 41.96378708,
              strokeLinejoin: 'round',
              strokeMiterlimit: 4,
              strokeDasharray: 'none',
              strokeDashoffset: 0,
              strokeOpacity: 1,
            }}
            d="m 144.16452,21.032222 h 159.67454 q 123.1748,0 123.1748,128.667868 v 212.64759 q 0,128.66788 -123.1748,128.66788 H 144.16452 q -123.174811,0 -123.174811,-128.66788 V 149.70009 q 0,-128.667868 123.174811,-128.667868 z"
          />
          {batteryLevels(severity)}
        </svg>
      </i>
      {!labelHidden && <span className="label"> {label} </span>}
    </React.Fragment>
  );
};

export default Battery;

Battery.propTypes = {
  severity: propTypes.oneOf([1, 2, 3, 4, 'info', 'low', 'warn', 'medium', 'error', 'high', 'critical']),
  label: propTypes.string.isRequired,
  labelHidden: propTypes.bool,
  className: propTypes.string,
};

Battery.defaultProps = {
  severity: 'null',
};
