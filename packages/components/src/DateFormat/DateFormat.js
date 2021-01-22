import React from 'react';
import PropTypes from 'prop-types';
import { dateByType } from './helper';

export default function DateFormat({ date, type = 'relative', extraTitle, tooltipProps = {} }) {
    const dateObj = date instanceof Date ? date : new Date(date);
    // Prevent treating null as valid. (new Date(null) == new Date(0) returns 1970 Jan 1)
    const invalid = date === undefined || date === null || dateObj.toString() === 'Invalid Date';
    const dateType = invalid ? 'invalid' : type;
    return (
        <React.Fragment>
            {dateByType(dateType, tooltipProps, extraTitle)(dateObj)}
        </React.Fragment>
    );
}

DateFormat.propTypes = {
    date: PropTypes.oneOfType([ PropTypes.instanceOf(Date), PropTypes.string, PropTypes.number ]),
    type: PropTypes.oneOf([ 'exact', 'onlyDate', 'relative' ]),
    extraTitle: PropTypes.string,
    tooltipProps: PropTypes.shape({
        [PropTypes.string]: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ])
    })
};
