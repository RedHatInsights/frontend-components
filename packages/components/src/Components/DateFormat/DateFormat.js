import React from 'react';
import PropTypes from 'prop-types';
import { dateStringByType } from './helper';

export default function DateFormat({ date, type = 'relative' }) {
    const dateObj = date instanceof Date === 'Date' ? date : new Date(date);
    return <React.Fragment>{dateStringByType(dateObj.toString() === 'Invalid Date' ? 'invalid' : type)(dateObj)}</React.Fragment>;
}

DateFormat.propTypes = {
    date: PropTypes.oneOfType([ PropTypes.instanceOf(Date), PropTypes.string ]),
    type: PropTypes.oneOf([ 'exact', 'onlyDate', 'relative' ])
};
