import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import { generateID } from '../../functions/generateID.js';

const checkTypes = [ 'checkbox', 'radio' ];

const Input = ({ type = 'text', ariaLabel = type, className, ...props }) => {
    const classes = checkTypes.indexOf(type) !== -1 ? 'pf-c-check' : 'pf-c-form-control';
    return (
        <input { ...props }
            widget-type='InsightsInput'
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

Input.defaultProps = {
    'widget-id': generateID('Table')
};

export default Input;
