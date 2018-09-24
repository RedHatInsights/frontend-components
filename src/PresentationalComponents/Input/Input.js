import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

const checkTypes = [ 'checkbox', 'radio' ];

const Input = ({ type = 'text', ariaLabel = type, className, ...props }) => {
    const classes = checkTypes.indexOf(type) !== -1 ? 'pf-c-check' : 'pf-c-form-control';
    return (
        <input { ...props }
            type={ type }
            aria-label={ ariaLabel }
            className={ classnames(classes, className) }
        />
    );
};

Input.propTypes = {
    type: PropTypes.string,
    className: PropTypes.string,
    ariaLabel: PropTypes.string
};

export default Input;
