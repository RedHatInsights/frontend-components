import React, { useMemo } from 'react';

import PropTypes from 'prop-types';
import { Tooltip } from '@patternfly/react-core';
import classNames from 'classnames';
import './severity-line.scss';

const chartMapper = (width) => ({
  1: '1',
  2: width / 3,
  3: width * (2 / 3),
  4: width - 1,
});

const SeverityLine = ({ title, value, className, tooltipMessage, config, chartProps }) => {
  const { width, height } = config;
  const severity = useMemo(() => chartMapper(width)?.[value], [width, value]);
  const chartClasses = classNames(className, 'ins-c-severity-line');
  const points = [
    { className: 'horizontal', points: `${1}, ${height / 2} ${width - 1}, ${height / 2}` },
    { className: 'vertical', points: `${width - 1}, ${0} ${width - 1}, ${height}` },
    { className: 'vertical', points: `${width * (2 / 3)}, ${0} ${width * (2 / 3)}, ${height}` },
    { className: 'vertical', points: `${width / 3}, ${0} ${width / 3}, ${height}` },
    { className: 'vertical', points: `${1}, ${0} ${1}, ${height}` },
    { className: `dataline-${value}`, points: `${1}, ${height / 2} ${severity}, ${height / 2}` },
  ];

  return (
    <div className={chartClasses} {...chartProps}>
      <div className="ins-l-title">
        {title.length > 14 ? (
          <Tooltip content={title}>
            <span> {`${title.substring(0, 14)}...`} </span>
          </Tooltip>
        ) : (
          <span> {title} </span>
        )}
      </div>
      {severity && (
        <div className="ins-l-chart">
          <svg height={height} width={width} viewBox={`0 0 ${width} ${height}`}>
            {points.map(({ className, points }, key) => (
              <polyline key={key} className={className} points={points} />
            ))}
            {tooltipMessage ? (
              <Tooltip content={tooltipMessage}>
                <circle className={`dataline-${value}`} cx={`${severity}`} cy={`${height / 2}`} r={`${2}`} />
              </Tooltip>
            ) : (
              <circle className={`dataline-${value}`} cx={`${severity}`} cy={`${height / 2}`} r={`${2}`} />
            )}
          </svg>
        </div>
      )}
    </div>
  );
};

SeverityLine.propTypes = {
  value: PropTypes.number.isRequired,
  title: PropTypes.node.isRequired,
  className: PropTypes.string,
  tooltipMessage: PropTypes.node,
  config: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
  }),
  chartProps: PropTypes.shape({
    [PropTypes.string]: PropTypes.any,
  }),
};

SeverityLine.defaultProps = {
  config: {
    height: 12,
    width: 302,
  },
};

export default SeverityLine;
