import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './spinner.scss';

const Spinner = ({ centered, className, ...props }) => {

    let spinnerClasses = classNames(
        'ins-c-spinner',
        { [`ins-m-center`]: centered },
        className
    );

    return (
        <div role='status' className={ spinnerClasses } { ...props }>
            <span className="pf-u-screen-reader">Loading...</span>
        </div>
    );
};

Spinner.propTypes = {
    centered: PropTypes.bool,
    className: PropTypes.string
};

export default Spinner;
