import React, { Fragment } from 'react';
import { TextInput, TextArea, Checkbox, Radio, Select, SelectOption } from '@patternfly/react-core';
import PropTypes from 'prop-types';

const selectComponent = ({ componentType, input, options, groupValues, ...rest }) => ({
    textField: () => <TextInput id={ input.name } { ...input } { ...rest } />, // eslint-disable-line react/display-name
    textarea: () => <TextArea id={ input.name } { ...input } { ...rest } />, // eslint-disable-line react/display-name
    switch: () => <Checkbox id={ input.name } { ...input } value={ !!input.value } { ...rest } />, // eslint-disable-line react/display-name
    radio: () => <Radio // eslint-disable-line react/display-name
        id={ input.name }
        { ...input }
        onChange={ () => input.onChange(input.value) }
        value={ !!input.value }
        { ...rest }
    />,
    select: () => ( // eslint-disable-line react/display-name
        <Select id={ input.name } { ...input } { ...rest } value={ input.value || 'empty' } >
            { options.map(({ label, value, disabled }) => <SelectOption key={ value } value={ value } label={ label } isDisabled={ disabled } />) }
        </Select>
    ),
    checkbox: () => { // eslint-disable-line react/display-name
        const indexValue = groupValues.indexOf(input.value);
        return <Checkbox id={ `${input.name}-${input.value}` } { ...input } value={ indexValue !== -1 } onChange={ () => {
            indexValue === -1
                ? input.onChange([ ...groupValues, input.value ])
                : input.onChange([ ...groupValues.slice(0, indexValue), ...groupValues.slice(indexValue + 1) ]);
        } } { ...rest } />;
    }
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
            { selectComponent({ componentType,  value: rest.input.value || rest.default || '', ...rest, isValid: !showError })() }
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

export const RadioField = props => <FinalFormField componentType="radio" { ...props } />;

export const CheckboxField = props => <FinalFormField componentType="checkbox" { ...props } />;

export const SelectField = props => <FinalFormField componentType="select" { ...props } />;

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

export const InputGroup = ({ description, title, type, children, ...rest }) => {
    return (
        <Fragment>
            { title && <h3>{ title }</h3> }
            { description && <p>{ description }</p> }
            { children }
        </Fragment>
    );
};

InputGroup.propTypes = {
    description: PropTypes.string,
    type: PropTypes.string,
    title: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired
};

InputGroup.defaultProps = {
    description: undefined,
    title: undefined,
    children: undefined
};
