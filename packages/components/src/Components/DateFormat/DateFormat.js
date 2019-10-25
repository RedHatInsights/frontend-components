import React from 'react';
import PropTypes from 'prop-types';
import { dateStringByType } from './helper';

export default function DateFormat({ date, type = 'relative' }) {
    const dateObj = date instanceof Date ? date : new Date(date);
    const dateType = dateObj.toString() === 'Invalid Date' ? 'invalid' : type;
    return (
        <React.Fragment>
            {dateStringByType(dateType)(dateObj)}
        </React.Fragment>
    );
}

DateFormat.propTypes = {
    date: PropTypes.oneOfType([ PropTypes.instanceOf(Date), PropTypes.string, PropTypes.number ]),
    type: PropTypes.oneOf([ 'exact', 'onlyDate', 'relative' ])
};
