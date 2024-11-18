import React from 'react';
import { Tooltip } from '@patternfly/react-core/dist/dynamic/components/Tooltip';
import { TooltipProps } from '@patternfly/react-core/dist/dynamic/components/Tooltip';

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;
const month = day * 30; // let's count that every month has 30 days
const year = day * 365;
const formatTime = (number: number, unit: string) => `${number} ${number > 1 ? `${unit}s` : unit} ago`;

const relativeTimeTable = [
  { rightBound: Infinity, description: (date: number) => formatTime(Math.round(date / year), 'year') },
  { rightBound: year, description: (date: number) => formatTime(Math.round(date / month), 'month') },
  { rightBound: month, description: (date: number) => formatTime(Math.round(date / day), 'day') },
  { rightBound: day, description: (date: number) => formatTime(Math.round(date / hour), 'hour') },
  { rightBound: hour, description: (date: number) => formatTime(Math.round(date / minute), 'minute') },
  { rightBound: minute, description: () => 'Just now' },
];

const exact = (value: Date) => value.toUTCString().split(',')[1].slice(0, -7).trim();

export const addTooltip = (date: React.ReactNode, element?: React.ReactElement, tooltipProps?: TooltipProps, extraTitle: React.ReactNode = '') => (
  <Tooltip
    {...tooltipProps}
    content={
      <div>
        {extraTitle}
        {date}
      </div>
    }
  >
    {element}
  </Tooltip>
);

export type DateType = 'exact' | 'onlyDate' | 'relative' | 'invalid';

export const dateStringByType = (type: DateType) =>
  ({
    exact: (date: Date) => exact(date) + ' UTC',
    onlyDate: (date: Date) => exact(date).slice(0, -6),
    relative: (date: Date) =>
      relativeTimeTable.reduce(
        (acc, i) => (i.rightBound > Date.now() - date.getTime() ? i.description(Date.now() - date.getTime()) : acc),
        exact(date)
      ),
    invalid: () => 'Invalid date',
  }[type]);

export const dateByType = (type: DateType, tooltipProps?: TooltipProps, extraTitle?: React.ReactNode) =>
  ({
    exact: (date: Date) => dateStringByType(type)(date),
    onlyDate: (date: Date) => dateStringByType(type)(date),
    relative: (date: Date) => addTooltip(dateStringByType('exact')(date), <span>{dateStringByType(type)(date)}</span>, tooltipProps, extraTitle),
    invalid: () => 'Invalid date',
  }[type]);
