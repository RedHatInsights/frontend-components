import React from 'react';
import { dateByType } from './helper';
import { TooltipProps } from '@patternfly/react-core/dist/dynamic/components/Tooltip';
import { DateType } from './helper';

export interface DateFormatProps {
  date: Date | number | string;
  /**
   * Output format of the date
   */
  type?: Exclude<DateType, 'invalid'>;
  /**
   * Additional text in the tooltip
   */
  extraTitle?: React.ReactNode;
  /**
   * <a target="_blank" href="https://www.patternfly.org/v4/components/tooltip/#props">PF Tooltip props object</a>
   */
  tooltipProps?: TooltipProps;
}

/**
 * @deprecated Do not use deprecated DateFormat component, use official PatternFly Timestamp instead
 * A component that formats date to a unified CRC format.
 * Relative date format adds a tooltip with a full date string.
 */
const DateFormat: React.FunctionComponent<DateFormatProps> = ({ date, type = 'relative', extraTitle, tooltipProps }) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  const invalid = date === undefined || date === null || dateObj.toString() === 'Invalid Date';
  const dateType = invalid ? 'invalid' : type;
  return <React.Fragment>{dateByType(dateType, tooltipProps, extraTitle)(dateObj)}</React.Fragment>;
};

export default DateFormat;
