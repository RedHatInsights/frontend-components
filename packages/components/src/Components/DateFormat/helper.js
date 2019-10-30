import React from 'react';
import { Tooltip } from '@patternfly/react-core';

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;
const month = day * 30; // let's count that every month has 30 days
const year = day * 365;

const relativeTimeTable = [
    { rightBound: year, description: date => `${Math.round(date / (month))} months ago` },
    { rightBound: month, description: date => `${Math.round(date / (day))} days ago` },
    { rightBound: 2 * day, description: () => '1 day ago' },
    { rightBound: day, description: date => `${Math.round(date / (hour))} hours ago` },
    { rightBound: hour, description: date => `${Math.round(date / (minute))} minutes ago` },
    { rightBound: minute, description: () => 'Just now' }
];

const exact = (value) => value.toUTCString().split(',')[1].slice(0, -4).trim();

export const addTooltip = (date, element) => (
    <Tooltip
        content={<div>{date}</div>}
    >
        {element}
    </Tooltip>);

export const dateStringByType = (type) => ({
    exact: date => exact(date) + ' UTC',
    onlyDate: date => exact(date).slice(0, -9),
    relative: date => relativeTimeTable.reduce((acc, i) => (i.rightBound > Date.now() - date ? i.description(Date.now() - date) : acc), exact(date)),
    invalid: () => 'Invalid Date'
})[type];

export const dateByType = (type) => ({
    exact: date => dateStringByType(type)(date),
    onlyDate: date => dateStringByType(type)(date),
    relative: date => addTooltip(date, <span>{dateStringByType(type)(date)}</span>),
    invalid: () => 'Invalid Date'
})[type];
