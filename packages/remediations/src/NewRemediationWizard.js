import React, { Component, Fragment, createContext } from 'react';
import transform from 'lodash/transform';
import FormRenderer from '@data-driven-forms/react-form-renderer/dist/cjs/form-renderer';
import Pf4FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/cjs/form-template';
import schemaBuilder from './schema';
import Deferred from '@redhat-cloud-services/frontend-components-utilities/files/Deffered';
import Wizard from '@data-driven-forms/pf4-component-mapper/dist/cjs/wizard';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import SelectPlaybook from './newSteps/selectPlaybook';
import * as api from './api';

const RemediationWizardContext = createContext({
    success: false,
    submitting: false,
    error: undefined
});

class RemediationWizard extends Component {

    state = {
        open: false,
        schema: {}
    }

    constructor() {
        super();
        this.container = React.createRef(document.createElement('div'));
    }

    setOpen = open => {
        this.setState({ open });
    }

    getFormTemplate = (props) => <Pf4FormTemplate {...props} showFormControls={false} />;

    openWizard = (data, basePath) => {
        const deferred = new Deferred();
        this.setState({
            open: true,

            schema: schemaBuilder(this.container.current),

            wizardContextValue: {
                success: false,
                submitting: false,
                error: undefined,
                hideForm: false,
                issues: data.issues,
                systems: data.systems
            },
            mapperExtension: {
                'select-playbook': {
                    component: SelectPlaybook,
                    SelectPlaybookProps: {
                        issues: data.issues,
                        systems: data.systems
                    }
                }
            }
        });

        this.loadResolutions(data.issues);

        return deferred.promise;
    }

    setWizardError = (error) => this.setState({ wizardContextValue: { ...this.state.wizardContextValue, error } });

    setWizardSuccess = (success) => this.setState({ wizardContextValue: { ...this.state.wizardContextValue, success } });

    setHideForm = (hideForm) => this.setState({ wizardContextValue: { ...this.state.wizardContextValue, hideForm } });

    closeWizard = () => {
        this.setOpen(false);
    }

    loadRemediations = async () => {
        const { data: existingRemediations } = await api.getRemediations();
        this.setState({ existingRemediations });
    }

    loadResolutions = async (issues) => {
        try {
            const result = await api.getResolutionsBatch(issues.map(i => i.id));

            const [ resolutions, errors ] = transform(result, ([ resolutions, errors ], value, key) => {
                if (!value) {
                    errors.push(`Issue ${key} does not have Ansible support`);
                } else {
                    resolutions.push(value);
                }

                return [ resolutions, errors ];
            }, [ [], [] ]);

            this.setState({ resolutions, errors });
        } catch (e) {
            this.setState({ errors: [ 'Error obtaining resolution information. Please try again later.' ] });
        }
    }

    render () {

        return (
            this.state.open ?
                <RemediationWizardContext.Provider
                    value={{ ...this.state.wizardContextValue,
                        setWizardError: this.setWizardError,
                        setWizardSuccess: this.setWizardSuccess,
                        setHideForm: this.setHideForm }}>
                    <FormRenderer
                        schema={this.state.schema}
                        container={this.container}
                        subscription={{ values: true }}
                        FormTemplate={this.getFormTemplate}
                        componentMapper={{
                            [componentTypes.WIZARD]: Wizard,
                            ...this.state.mapperExtension
                        }}
                        onSubmit={() => undefined}
                        onCancel={this.closeWizard}
                    />
                </RemediationWizardContext.Provider>
                : <Fragment/>
        );
    }
}

export default RemediationWizard;
