import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, Button, Title } from '@patternfly/react-core';
import { Form, Field } from 'react-final-form';
import componentMapper from './componentMapper';
import validationMapper from './validationMapper';
import { composeValidators } from '../Helpers/helpers';

const renderFields = (properties, uiSchema, globalValidators, options) => Object.keys(properties).map((key) => {
    const { component, type } = componentMapper(properties[key].type, uiSchema[key] ? uiSchema[key]['ui:widget'] : undefined);
    const minLength = properties[key].minLength ? validationMapper('minLength')(properties[key].minLength) : undefined;
    return (
        <GridItem sm={ 12 } key={ key }>
            <Field
                name={ key }
                label={ properties[key].title }
                component={ component }
                type={ type }
                validate={ composeValidators(globalValidators[key] && globalValidators[key], minLength) }
                autoFocus={ options.autoFocus === key }
                isRequired={ globalValidators[key] && globalValidators[key].name === 'required' }
            />
        </GridItem>
    );
});

const renderTitle = (title, description) => (
    <div className="final-form-title">
        { title && <Fragment><Title size="3xl">{ title }</Title></Fragment> }
        { description && <Title size="lg">{ description }</Title> }
    </div>
);

const setGlobalValidation = validators => validators.reduce((acc, accur) => ({ ...acc, [accur]: validationMapper('required') }), {});

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
        const { schema, uiSchema, onSubmit } = this.props;
        const {
            title, description, properties
        } = schema;
        const { mounted, autoFocusField } = this.state;
        const globalValidators = setGlobalValidation(schema.required);
        return (
            <Fragment>
                { title && renderTitle(title, description) }
                <Form
                    subscription={ { submitting: true, pristine: true } }
                    onSubmit={ onSubmit }
                    initialValues={ createInitialValues(properties) }
                    render={ ({ form: { focus }, handleSubmit }) => {
                        if (!mounted && autoFocusField) {
                            focus(autoFocusField);
                        }

                        return (
                            <form className=".pf-c-form">
                                <Grid>
                                    <GridItem>
                                        { renderFields(properties, uiSchema, globalValidators, {
                                            autoFocus: autoFocusField
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
    onSubmit: PropTypes.func.isRequired
};

FormRenderer.defaultProps = {
    uiSchema: {}
};

export default FormRenderer;
