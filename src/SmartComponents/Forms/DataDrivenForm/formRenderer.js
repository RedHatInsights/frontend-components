import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, Button } from '@patternfly/react-core';
import { Form, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import componentMapper from './componentMapper';
import validationMapper from './validationMapper';
import { FormTitle, FormField, Select, BooleanGroup, Condition } from './formComponents';
import { composeValidators, optionsMapper, componentArrayMapper } from '../Helpers/helpers';
import { SelectField } from '../FormFields/formFields';

const setGlobalValidation = (validators = []) => validators.reduce((acc, accur) => ({ ...acc, [accur]: validationMapper('required') }), {});

BooleanGroup.propTypes = {
    type: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string
};

const prepareArrayProperties = ({
    properties,
    uiSchema = {},
    validators = [],
    fieldArrayName
}) => {
    const newProperties = {};
    const newUiSchema = {};
    const globalValidators = setGlobalValidation(validators.map(field => `${fieldArrayName}.${field}`));
    Object.keys(properties).forEach(key => newProperties[`${fieldArrayName}.${key}`] = properties[key]);
    Object.keys(uiSchema).forEach(key => newUiSchema[`${fieldArrayName}.${key}`] = uiSchema[key]);
    return { properties: newProperties, uiSchema: newUiSchema, globalValidators };
};

const renderFieldArray = ({ items, key, push }) => {
    const { component, type } = componentMapper(items.type);
    const fieldProps = {
        type,
        component,
        label: '',
        placeholder: items.default
    };
    return (
        <Fragment>
            <FieldArray
                name={ key }
                render={ ({ fields }) => fields.map((name, index) => (
                    <Fragment key={ `${name}-${index}` } >
                        <FormField
                            name={ name }
                            { ...fieldProps }
                        />
                        <button type="button" onClick={ () =>fields.remove(index) } >Remove</button>
                    </Fragment>
                )) }
            />
            <button id={ `add-${key}` } type="button" onClick={ () => push(key) }>
                    Add { key }
            </button>
        </Fragment>
    );
};

renderFieldArray.propTypes = {
    items: PropTypes.object.isRequired,
    key: PropTypes.string.isRequired,
    push: PropTypes.func
};

const renderChoiceList =  ({ items, key, uiSchema = {}}) => {
    const { component, type } = componentMapper(items.type, uiSchema['ui:widget']);
    return (<Field name={ key }>
        { ({ input: value }) => {
            const groupValues = value.value === '' ? [] : value.value;
            return (
                <BooleanGroup groupValues={ groupValues } type={ type } component={ component } name={ key } options={ items.enum } />
            );} }
    </Field>);
};

renderChoiceList.propTypes = {
    items: PropTypes.object.isRequired,
    key: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    uiSchema: PropTypes.object
};

const renderArrayList = ({ items, uiSchema, key, additionalItems, push }) => {
    const startingIndex = items.length;
    return (
        <Fragment>
            { items.map(({ type, title, ...rest }, index) => {
                const fieldProps = {
                    ...componentMapper(type, uiSchema.items && uiSchema.items[index]['ui:widget']),
                    label: title,
                    name: `${key}.${index}`,
                    ...rest
                };
                if (fieldProps.type === 'select') {
                    return <Select key={ `${key}-${title}` } { ...fieldProps } />;
                }

                return <FormField key={ `${key}-${title}` } { ...fieldProps } />;
            }) }
            <FieldArray
                name={ key }
                render={ ({ fields }) => fields.map((name, index) => {
                    const fieldProps = {
                        ...componentMapper(additionalItems.type, uiSchema.additionalItems['ui:widget']),
                        label: additionalItems.title || '',
                        name: `${key}.${index + startingIndex}`
                    };
                    return (
                        <Fragment key={ `${name}-${name + startingIndex}` }>
                            <FormField { ...fieldProps } />
                            <button type="button" onClick={ () => fields.pop() } >Remove { index } { startingIndex }</button>
                        </Fragment>
                    );
                }) }
            />
            <button id={ `add-${key}` } type="button" onClick={ () => push(key) }>
                    Add addition field
            </button>
        </Fragment>
    );
};

renderArrayList.propTypes = {
    items: PropTypes.array,
    uiSchema: PropTypes.object,
    key: PropTypes.string,
    additionalItems: PropTypes.object,
    push: PropTypes.func
};

const renderArray = ({ items: { items, additionalItems, ...restItem }, uiSchema, key, ...rest }) => ({
    choiceList: () => renderChoiceList({ items, key, uiSchema, ...rest }),
    itemList: () => renderFieldArray({ items, key, ...rest, ...restItem }),
    arrayList: () => renderArrayList({ items, uiSchema, key, additionalItems, ...rest }),
    nestedList: () => undefined
})[componentArrayMapper({ items })];

const renderFields = ({ properties, uiSchema = {}, globalValidators = [], options, dependencies }) => Object.keys(properties).map((key) => {

    if (dependencies && dependencies[key] && dependencies[key].oneOf) {
        const dependeciesProperties = {
            [key]: { ...properties[key] },
            ...dependencies[key].oneOf.reduce((acc, curr) => {
                const conditionValues = [ ...curr.properties[key].enum ];
                const properties = { ...curr.properties };
                delete properties[key];
                const enhancedProperties = Object.keys(properties).reduce((accumulator, propertyKey) =>
                    ({ ...accumulator, [propertyKey]: { ...properties[propertyKey], condition: {
                        when: key, is: conditionValues
                    }}}), {});
                return { ...acc, ...enhancedProperties };
            }, {})
        };
        return renderFields({ properties: dependeciesProperties, uiSchema, globalValidators, options });
    }

    if (properties[key].$ref) {
        const { $ref, ...rest } = properties[key];
        return renderFields({
            properties: {
                [key]: { ...rest, ...options.definitions[$ref.split('/').pop()] }
            }, uiSchema, globalValidators, options
        });
    }

    if ((properties[key].type === 'object')) {
        return (
            <Fragment key={ properties[key].title }>
                { properties[key].title && <FormTitle title={ properties[key].title } description={ properties[key].description } /> }
                { renderFields({ properties: properties[key].properties, uiSchema: uiSchema[key], options }) }
            </Fragment>
        );
    }

    if (properties[key].type === 'array' && !properties[key].items.properties && properties[key].items.type !== 'array') {
        return (
            <React.Fragment key={ key }>
                { properties[key].title && <FormTitle title={ properties[key].title } description={ properties[key].description } /> }
                { renderArray({ items: properties[key], key, push: options.push, uiSchema: uiSchema[key] && uiSchema[key]  })() }
            </React.Fragment>
        );
    }

    if (properties[key].type === 'array' && !properties[key].items.properties && properties[key].items.type === 'array') {
        return (
            <React.Fragment key={ key }>
                { properties[key].title && <FormTitle title={ properties[key].title } description={ properties[key].description } /> }
                <button id={ `add-${key}` } type="button" onClick={ () => options.push(key) }>
                    Add { properties[key].title }
                </button>
                <FieldArray
                    name={ key }
                    render={ ({ fields }) => fields.map((name, index) => (
                        <Fragment key={ `${name}-${index}` }>
                            { renderFields({ properties: { [`${name}.${index}`]: {
                                ...properties[key].items
                            }}, uiSchema: uiSchema[key] && uiSchema[key].items, options  }) }
                            <button id={ `remove-${name}-${index}` } type="button" onClick={ () => fields.remove(index) }>
                                Remove { key }
                            </button>
                        </Fragment>
                    )) }
                />
            </React.Fragment>
        );
    }

    if (properties[key].type === 'array') {
        return (
            <React.Fragment key={ key }>
                { properties[key].title && <FormTitle title={ properties[key].title } description={ properties[key].description } /> }
                <button id={ `add-${key}` } type="button" onClick={ () => options.push(key) }>
                    Add { key }
                </button>
                <FieldArray
                    name={ key }
                    render={ ({ fields }) =>  fields.map((name, index) => (
                        <React.Fragment key={ `${name}-${index}` }>
                            { renderFields({ ...prepareArrayProperties({
                                properties: properties[key].items.properties,
                                uiSchema: uiSchema[key] ? uiSchema[key].items : undefined,
                                validators: properties[key].items.required,
                                fieldArrayName: name
                            }), options: { type: 'array', push: options.push }}) }
                            <button id={ `remove-${name}-${index}` } type="button" onClick={ () => fields.remove(index) }>
                                Remove { key }
                            </button>
                        </React.Fragment>
                    )) }
                />
            </React.Fragment>
        );
    }

    const { component, type } = componentMapper(
        properties[key].enum ? 'select' : properties[key].type,
        uiSchema[key] ? uiSchema[key]['ui:widget'] : properties[key].format || undefined
    );
    const widgetOptions = uiSchema[key] ? optionsMapper(uiSchema[key]) : {};
    const minLength = properties[key].minLength ? validationMapper('minLength')(properties[key].minLength) : undefined;
    const fieldProps = {
        key,
        name: key,
        label: properties[key].title || key,
        description: properties[key].description,
        component,
        type,
        validate: composeValidators(globalValidators[key] && globalValidators[key], minLength),
        autoFocus: options.autoFocus === key,
        isRequired: globalValidators[key] && globalValidators[key].name === 'required',
        ...widgetOptions
    };
    if (type === 'select') {
        return <Select { ...fieldProps } options={ properties[key].enum } optionsNames={ properties[key].enumNames } />;
    }

    if (properties[key].type === 'boolean') {
        return <BooleanGroup type={ type } { ...fieldProps } />;
    }

    if (properties[key].anyOf) {
        return <FormField { ...fieldProps } component={ SelectField } type="select" options={ properties[key].anyOf.map(({ title, ...rest }) =>
            ({ label: title, value: rest.enum[0] })) }/>;
    }

    if (properties[key].condition) {
        return (
            <Condition key={ key } when={ properties[key].condition.when } is={ properties[key].condition.is }>
                <FormField key={ key } { ...fieldProps } />
            </Condition>
        );
    }

    return <FormField key={ key } { ...fieldProps } />;
});

const createInitialValues = properties => {
    const initialValues = {};
    Object.keys(properties).filter(key => !!properties[key].default).forEach(key => initialValues[key] = properties[key].default);
    return initialValues;
};

class FormRenderer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            autoFocusField: Object.keys(props.schema.properties).find(key => props.uiSchema[key] && props.uiSchema[key]['ui:autofocus'])
        };
    }
    componentDidMount() {
        this.setState({ mounted: true });
    }

    render() {
        const { schema, uiSchema, onSubmit, initialValues, onCancel } = this.props;
        const { title, description, properties, type, dependencies } = schema;
        const { mounted, autoFocusField } = this.state;
        const globalValidators = setGlobalValidation(schema.required);
        return (
            <Fragment>
                { title && <FormTitle title={ title } description={ description } /> }
                <Form
                    mutators={ { ...arrayMutators } }
                    onSubmit={ onSubmit }
                    subscription={ { pristine: true, submitting: true } }
                    initialValues={ { ...createInitialValues(properties), ...initialValues } }
                    render={ ({ form: { focus, mutators: { push, remove }}, handleSubmit }) => {
                        !mounted && autoFocusField && focus(autoFocusField);
                        return (
                            <form className=".pf-c-form">
                                <Grid>
                                    <GridItem>
                                        { renderFields({
                                            properties,
                                            uiSchema,
                                            globalValidators,
                                            dependencies,
                                            options: {
                                                autoFocus: autoFocusField,
                                                type,
                                                push,
                                                remove,
                                                definitions: schema.definitions
                                            }}) }
                                    </GridItem>
                                    <GridItem>
                                        <Button id="form-renderer-submit" variant="primary" onClick={ handleSubmit }>Submit</Button>
                                        { onCancel && <Button id="form-renderer-cancel" onClick={ onCancel }>Cancel</Button> }
                                    </GridItem>
                                </Grid>
                            </form>
                        );
                    } }
                />
            </Fragment>
        );
    }
}

FormRenderer.propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.object,
    onCancel: PropTypes.func
};

FormRenderer.defaultProps = {
    uiSchema: {},
    initialValues: {},
    onCancel: undefined
};

export default FormRenderer;
