import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, Button, Title } from '@patternfly/react-core';
import { Form, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import componentMapper from './componentMapper';
import validationMapper from './validationMapper';
import { composeValidators } from '../Helpers/helpers';

const setGlobalValidation = validators => validators.reduce((acc, accur) => ({ ...acc, [accur]: validationMapper('required') }), {});

const renderTitle = (title, description) => (
    <div className="final-form-title">
        { title && <Fragment><Title size="3xl">{ title }</Title></Fragment> }
        { description && <Title size="lg">{ description }</Title> }
    </div>
);

const renderSingleField = props => (
    <GridItem sm={ 12 } key={ props.key }>
        <Field { ...props } />
    </GridItem>
);

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
    return [ newProperties, newUiSchema, globalValidators ];
};

const renderFields = (properties, uiSchema, globalValidators, options) => Object.keys(properties).map((key) => {
    if (properties[key].type === 'array') {
        return (
            <React.Fragment key={ key }>
                { properties[key].title && renderTitle(properties[key].title) }
                <button id={ `add-${key}` } type="button" onClick={ () => options.push(key) }>
                    Add { key }
                </button>
                <FieldArray
                    name={ key }
                    render={ ({ fields }) =>  fields.map((name, index) => (
                        <React.Fragment key={ `${name}-${index}` }>
                            { renderFields(...prepareArrayProperties({
                                properties: properties[key].items.properties,
                                uiSchema: uiSchema[key] ? uiSchema[key].items : undefined,
                                validators: properties[key].items.required,
                                fieldArrayName: name
                            }), { type: 'array', push: options.push }) }

                            <button id={ `remove-${name}-${index}` } type="button" onClick={ () => fields.remove(index) }>
                                Remove { key }
                            </button>
                        </React.Fragment>
                    )) }
                />
            </React.Fragment>
        );
    }

    const { component, type } = componentMapper(properties[key].type, uiSchema[key] ? uiSchema[key]['ui:widget'] : undefined);
    const minLength = properties[key].minLength ? validationMapper('minLength')(properties[key].minLength) : undefined;
    const fieldProps = {
        key,
        name: key,
        label: properties[key].title,
        component,
        type,
        validate: composeValidators(globalValidators[key] && globalValidators[key], minLength),
        autoFocus: options.autoFocus === key,
        isRequired: globalValidators[key] && globalValidators[key].name === 'required'
    };
    return renderSingleField(fieldProps);
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
        const { schema, uiSchema, onSubmit, initialValues } = this.props;
        const {
            title, description, properties, type
        } = schema;
        const { mounted, autoFocusField } = this.state;
        const globalValidators = setGlobalValidation(schema.required);
        return (
            <Fragment>
                { title && renderTitle(title, description) }
                <Form
                    subscription={ { submitting: true, pristine: true } }
                    mutators={ {
                        ...arrayMutators
                    } }
                    onSubmit={ onSubmit }
                    initialValues={ {
                        ...createInitialValues(properties),
                        ...initialValues
                    } }
                    render={ ({ form: { focus, mutators: { push, remove }}, handleSubmit }) => {
                        if (!mounted && autoFocusField) {
                            focus(autoFocusField);
                        }

                        return (
                            <form className=".pf-c-form">
                                <Grid>
                                    <GridItem>
                                        { renderFields(properties, uiSchema, globalValidators, {
                                            autoFocus: autoFocusField,
                                            type,
                                            push,
                                            remove
                                        }) }
                                    </GridItem>
                                    <GridItem>
                                        <Button id="form-renderer-submit" variant="primary" onClick={ handleSubmit } >Submit</Button>
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
    initialValues: PropTypes.object
};

FormRenderer.defaultProps = {
    uiSchema: {},
    initialValues: {}
};

export default FormRenderer;
