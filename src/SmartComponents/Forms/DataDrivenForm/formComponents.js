import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Title, GridItem } from '@patternfly/react-core';
import { Field } from 'react-final-form';
import { InputGroup } from '../FormFields/formFields';

export const FormTitle = ({ title, description }) => (
    <div className="final-form-title">
        { title && <Fragment><Title size="3xl">{ title }</Title></Fragment> }
        { description && <Title size="lg">{ description }</Title> }
    </div>
);

FormTitle.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string
};

FormTitle.defaultProps = {
    title: undefined,
    description: undefined
};

export const FormField = props => (
    <GridItem sm={ 12 } key={ props.name }>
        <Field { ...props } />
    </GridItem>
);

export const Select = ({ options, optionsNames, ...rest }) => {
    const defaultOptions = [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }];
    const choices = options ? options.map((option, index) => ({ value: option, label: optionsNames[index] })) : defaultOptions;
    return <FormField options={ [{ value: 'empty', label: 'Please Choose', disabled: true }, ...choices ] } { ...rest } />;
};

export const RadioGroup = ({ type, ...props }) => {
    const { options, ...rest } = props;
    const choices = options || [ 'Yes', 'No' ];
    return !type && !options
        ? <FormField { ...rest } />
        : choices.map(choice =>
            <FormField key={ `${rest.name}-${choice}` } { ...rest } label={ choice } value={ choice } type={ type } />);
};

export const  BooleanGroup = ({ type, title, description, ...rest }) => (
    <InputGroup title={ type === 'radio' ? rest.label : title } description={ description } >
        <RadioGroup type={ type } { ...rest } />
    </InputGroup>
);

export const Condition = ({ when, is, children }) => {
    const shouldRender = value => Array.isArray(is) ? !!is.find(item => item === value) : value === is;
    return (
        <Field name={ when } subscription={ { value: true } }>
            { ({ input: { value }}) => shouldRender(value) ? children : null }
        </Field>
    );
};

Condition.propTypes = {
    when: PropTypes.string.isRequired,
    is: PropTypes.any,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired
};
