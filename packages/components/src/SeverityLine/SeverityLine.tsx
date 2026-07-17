import React, { useMemo } from 'react';

import { Tooltip } from '@patternfly/react-core/dist/dynamic/components/Tooltip';
import classNames from 'classnames';
import './severity-line.scss';

const chartMapper = (width: number) => ({
  1: '1',
  2: width / 3,
  3: width * (2 / 3),
  4: width - 1,
});

export type SeverityLineProps = {
  title: string;
  value: 1 | 2 | 3 | 4;
  className?: string;
  tooltipMessage?: React.ReactNode;
  config?: {
    height?: number;
    width?: number;
  };
  chartProps?: React.HTMLProps<HTMLDivElement>;
};

const defaultConfig = {
  height: 12,
  width: 302,
};

const SeverityLine = ({ title, value, className, tooltipMessage, config = defaultConfig, chartProps }: SeverityLineProps) => {
  const { width, height } = { ...defaultConfig, ...config };
  const severity = useMemo(() => {
    return chartMapper(width)?.[value];
  }, [width, value]);
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

export default SeverityLine;
