import React from 'react';
import { Tooltip } from '@patternfly/react-core';

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;
const month = day * 30; // let's count that every month has 30 days
const year = day * 365;
const formatTime = (number, unit) => {
    const rounded = Math.round(number);
    const unitPlural = rounded > 1 ? `${unit}s` : unit;
    if (number < rounded) {
        return `almost ${rounded} ${unitPlural} ago`;
    } else {
        return `${rounded} ${unitPlural} ago`;
    }
};

const relativeTimeTable = [
    { rightBound: Infinity, description: date => formatTime(date / year, 'year') },
    { rightBound: year, description: date => formatTime(date / month, 'month') },
    { rightBound: month, description: date => formatTime(date / day, 'day') },
    { rightBound: day, description: date => formatTime(date / hour, 'hour') },
    { rightBound: hour, description: date => formatTime(date / minute, 'minute') },
    { rightBound: minute, description: () => 'Just now' }
];

const exact = (value) => value.toUTCString().split(',')[1].slice(0, -7).trim();

export const addTooltip = (date, element, tooltipProps, extraTitle = '') => (
    <Tooltip
        {...tooltipProps}
        content={<div>{extraTitle}{date}</div>}
    >
        {element}
    </Tooltip>);

export const dateStringByType = (type) => ({
    exact: date => exact(date) + ' UTC',
    onlyDate: date => exact(date).slice(0, -6),
    relative: date => relativeTimeTable.reduce((acc, i) => (i.rightBound > Date.now() - date ? i.description(Date.now() - date) : acc), exact(date)),
    invalid: () => 'Invalid date'
})[type];

export const dateByType = (type, tooltipProps, extraTitle) => ({
    exact: date => dateStringByType(type)(date),
    onlyDate: date => dateStringByType(type)(date),
    relative: date => addTooltip(
        dateStringByType('exact')(date), <span>{dateStringByType(type)(date)}</span>, tooltipProps, extraTitle
    ),
    invalid: () => 'Invalid date'
})[type];
