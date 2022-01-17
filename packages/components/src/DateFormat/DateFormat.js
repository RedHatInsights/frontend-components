import React from 'react';
import PropTypes from 'prop-types';
import { dateByType } from './helper';

/**
 * A component that formats date to a unified CRC format.
 * Relative date format adds a tooltip with a full date string.
 */
export default function DateFormat({ date, type = 'relative', extraTitle, tooltipProps = {} }) {
  const dateObj = date instanceof Date ? date : new Date(date);
  // Prevent treating null as valid. (new Date(null) == new Date(0) returns 1970 Jan 1)
  const invalid = date === undefined || date === null || dateObj.toString() === 'Invalid Date';
  const dateType = invalid ? 'invalid' : type;
  return <React.Fragment>{dateByType(dateType, tooltipProps, extraTitle)(dateObj)}</React.Fragment>;
}

DateFormat.propTypes = {
  date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string, PropTypes.number]),
  /**
   * Output format of the date
   */
  type: PropTypes.oneOf(['exact', 'onlyDate', 'relative']),
  /**
   * Additional text in the tooltip
   */
  extraTitle: PropTypes.node,
  /**
   * <a target="_blank" href="https://www.patternfly.org/v4/components/tooltip/#props">PF Tooltip props object</a>
   */
  tooltipProps: PropTypes.object,
};
