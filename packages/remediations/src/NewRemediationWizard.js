import React, { Component, Fragment, createContext } from 'react';
import FormRenderer from '@data-driven-forms/react-form-renderer/dist/cjs/form-renderer';
import Pf4FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/cjs/form-template';
import schemaBuilder from './schema';
import Deferred from '@redhat-cloud-services/frontend-components-utilities/files/Deffered';
import Wizard from '@data-driven-forms/pf4-component-mapper/dist/cjs/wizard';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';

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

    openWizard = () => {
        const deferred = new Deferred();
        this.setState({
            open: true,

            schema: schemaBuilder(this.container.current),

            wizardContextValue: {
                success: false,
                submitting: false,
                error: undefined,
                hideForm: false
            }
        });

        // TO DO - load remediations
        // TO DO - load resolutions

        return deferred.promise;
    }

    setWizardError = (error) => this.setState({ wizardContextValue: { ...this.state.wizardContextValue, error } });

    setWizardSuccess = (success) => this.setState({ wizardContextValue: { ...this.state.wizardContextValue, success } });

    setHideForm = (hideForm) => this.setState({ wizardContextValue: { ...this.state.wizardContextValue, hideForm } });

    closeWizard = () => {
        this.setOpen(false);
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
                            [componentTypes.WIZARD]: Wizard
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
