import React from 'react';
import propTypes from 'prop-types';

import classNames from 'classnames';

import './battery.scss';

/**
 * This is a dumb component that only recieves properties from a smart component.
 * Dumb components are usually functions and not classes.
 *
 * @param props the props given by the smart component.
 */

const Battery = ({severity, label, labelHidden, className, ...props}) => {
    let severityClass = classNames(
        { [`ins-battery-${severity}`]: severity !== undefined }
    );
    if(!labelHidden) {
        return (
            <span className='ins-battery'>
                <i className= { severityClass } />
                <span className='label'> { label } </span>
            </span>
        );
    } else {
        return (
            <span className='ins-battery'>
                <i className= { severityClass } aria-label= { label + ' ' + severity }/>
            </span>
        );
    };
};

export default Battery;

Battery.propTypes = {
    severity: propTypes.oneOfType([
        propTypes.string.isRequired,
        propTypes.number.isRequired
    ]),
    label: propTypes.string.isRequired,
    labelHidden: propTypes.bool
};
