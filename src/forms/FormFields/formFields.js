import React from 'react';
import { TextInput, TextArea, Checkbox } from '@patternfly/react-core';
import PropTypes from 'prop-types';

const selectComponent = ({ componentType, input, ...rest }) => ({
    textField: <TextInput id={ input.name } { ...input } { ...rest } />,
    textarea: <TextArea id={ input.name } { ...input } { ...rest } />,
    switch: <Checkbox id={ input.name } { ...input } value={ !!input.value } { ...rest } />
})[componentType];

const FinalFormField = ({
    componentType,
    label,
    isRequired,
    helperText,
    meta,
    ...rest
}) => {
    const { error, touched } = meta;
    const showError = touched && error;
    return (
        <div className="pf-c-form__group">
            <label className={ `pf-c-form__label ${isRequired ? 'pf-m-required' : ''}` } htmlFor={ rest.id }>{ label }</label>
            { selectComponent({ componentType, ...rest, isValid: !showError }) }
            { !showError && helperText && <p className="pf-c-form__helper-text">{ helperText }</p> }
            { showError && <p id={ `${rest.name}-helper` } className="pf-c-form__helper-text pf-m-error">{ error }</p> }
        </div>
    );
};

FinalFormField.propTypes = {
    componentType: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    isRequired: PropTypes.bool,
    helperText: PropTypes.string,
    meta: PropTypes.object
};

FinalFormField.defaultProps = {
    isRequired: false
};

export const TextField = props => <FinalFormField componentType="textField" { ...props } />;

export const TextareaField = props => <FinalFormField componentType="textarea" { ...props } />;

export const SwitchField = props => <FinalFormField componentType="switch" { ...props } />;

TextField.propTypes = {
    type: PropTypes.string,
    label: PropTypes.string.isRequired,
    isRequired: PropTypes.bool,
    helperText: PropTypes.string,
    meta: PropTypes.object
};

TextField.defaultProps = {
    type: 'text',
    isRequired: false,
    helperText: undefined,
    meta: {}
};
