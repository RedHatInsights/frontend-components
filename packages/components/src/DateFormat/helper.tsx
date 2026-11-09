import { getIntlWithFallback } from '@redhat-cloud-services/frontend-components-translations/localization';
import React from 'react';

import { Tooltip } from '@patternfly/react-core/dist/dynamic/components/Tooltip';
import { TooltipProps } from '@patternfly/react-core/dist/dynamic/components/Tooltip';
import messages from '../messages';

type LibraryIntl = ReturnType<typeof getIntlWithFallback>;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;
const month = day * 30; // let's count that every month has 30 days
const year = day * 365;
const relativeTimeTable = [
  { rightBound: Infinity, description: (date: number, intl: LibraryIntl) => intl.formatRelativeTime(-Math.round(date / year), 'year') },
  { rightBound: year, description: (date: number, intl: LibraryIntl) => intl.formatRelativeTime(-Math.round(date / month), 'month') },
  { rightBound: month, description: (date: number, intl: LibraryIntl) => intl.formatRelativeTime(-Math.round(date / day), 'day') },
  { rightBound: day, description: (date: number, intl: LibraryIntl) => intl.formatRelativeTime(-Math.round(date / hour), 'hour') },
  { rightBound: hour, description: (date: number, intl: LibraryIntl) => intl.formatRelativeTime(-Math.round(date / minute), 'minute') },
  {
    rightBound: minute,
    description: (_date: number, intl: LibraryIntl) => intl.formatMessage(messages.dateFormatJustNow),
  },
];

const exact = (value: Date, intl: LibraryIntl, onlyDate = false) => {
  // Keep the established English layout, including UTC and two-digit days.
  if (intl.locale.split('-')[0] === 'en') {
    const text = value.toUTCString().split(',')[1].slice(0, -7).trim();
    return onlyDate ? text.slice(0, -6) : text;
  }
  return intl.formatDate(value, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
    ...(!onlyDate ? { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' as const } : {}),
  });
};

export const addTooltip = (
  date: React.ReactNode,
  element?: React.ReactElement<any>,
  tooltipProps?: TooltipProps,
  extraTitle: React.ReactNode = '',
) => (
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

export const dateStringByType = (type: DateType, intl = getIntlWithFallback()) =>
  ({
    exact: (date: Date) => exact(date, intl) + ' UTC',
    onlyDate: (date: Date) => exact(date, intl, true),
    relative: (date: Date) =>
      relativeTimeTable.reduce(
        (acc, i) => (i.rightBound > Date.now() - date.getTime() ? i.description(Date.now() - date.getTime(), intl) : acc),
        exact(date, intl),
      ),
    invalid: () => intl.formatMessage(messages.dateFormatInvalidDate),
  })[type];

export const dateByType = (type: DateType, tooltipProps?: TooltipProps, extraTitle?: React.ReactNode, intl = getIntlWithFallback()) =>
  ({
    exact: (date: Date) => dateStringByType(type, intl)(date),
    onlyDate: (date: Date) => dateStringByType(type, intl)(date),
    relative: (date: Date) =>
      addTooltip(dateStringByType('exact', intl)(date), <span>{dateStringByType(type, intl)(date)}</span>, tooltipProps, extraTitle),
    invalid: () => intl.formatMessage(messages.dateFormatInvalidDate),
  })[type];
