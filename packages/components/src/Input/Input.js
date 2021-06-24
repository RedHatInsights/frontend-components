import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import { useOUIAId } from '@patternfly/react-core/';

const checkTypes = [ 'checkbox', 'radio' ];

const Input = ({ type = 'text', ariaLabel = type, className, ouiaId, ouiaSafe, ...props }) => {
    const classes = checkTypes.indexOf(type) !== -1 ? 'pf-c-check' : 'pf-c-form-control';
    const ouiaComponentType = 'RHI/Input';
    const ouiaFinalId = useOUIAId(ouiaComponentType, ouiaId, ouiaSafe);
    return (
        <input { ...props }
            data-ouia-component-type={ ouiaComponentType }
            data-ouia-component-id={ ouiaFinalId }
            data-ouia-safe={ ouiaSafe }
            type={ type }
            aria-label={ ariaLabel }
            className={ classnames(classes, className) }
        />
    );
};

Input.propTypes = {
    type: PropTypes.string,
    className: PropTypes.string,
    ariaLabel: PropTypes.string,
    ouiaId: PropTypes.string,
    ouiaSafe: PropTypes.bool
};

Input.defaultProps = {
    ouiaSafe: true
};

export default Input;
