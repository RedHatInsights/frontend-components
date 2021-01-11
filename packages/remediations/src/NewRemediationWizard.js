import React, { Component, Fragment, createContext } from 'react';
import keyBy from 'lodash/keyBy';
import transform from 'lodash/transform';
import FormRenderer from '@data-driven-forms/react-form-renderer/dist/cjs/form-renderer';
import Pf4FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/cjs/form-template';
import schemaBuilder from './schema';
import Deferred from '@redhat-cloud-services/frontend-components-utilities/files/Deffered';
import Wizard from '@data-driven-forms/pf4-component-mapper/dist/cjs/wizard';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import SelectPlaybook from './newSteps/selectPlaybook';
import ReviewActions from './newSteps/reviewActions';
import IssueResolution from './newSteps/issueResolution';
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

    getIssuesMultiple = (data, issuesById) => (
        data.issues.map(issue => {
            const resolutions = this.getResolution(issue.id);
            const { description, needs_reboot: needsReboot  } = resolutions?.[0] || {};
            return {
                action: issuesById[issue.id].description,
                resolution: description,
                needsReboot,
                systems: issue.systems ? issue.systems.length : data.systems.length,
                id: issue.id,
                alternate: resolutions.length - 1
            };
        }).filter(record => record.alternate > 1));

    openWizard = (data, basePath) => {
        const deferred = new Deferred();
        const issuesById = keyBy(data.issues, issue => issue.id);

        this.loadResolutions(data.issues).then(
            (values) => {
                this.setState(values);
                const issuesMultiple = this.getIssuesMultiple(data, issuesById);
                this.setState({
                    open: true,

                    schema: schemaBuilder(this.container.current, issuesMultiple),

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
                            },
                            loadResolutions: this.loadResolutions
                        },
                        'review-actions': {
                            component: ReviewActions,
                            issues: data.issues,
                            issuesMultiple
                        },
                        'issue-resolution': {
                            component: IssueResolution,
                            systems: data.systems,
                            issuesById: issuesById,
                            getResolution: this.getResolution
                        }
                    }
                });
            }
        );

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

            return { resolutions, errors };
        } catch (e) {
            return { errors: [ 'Error obtaining resolution information. Please try again later.' ] };
        }
    }

    getResolution = issueId => {
        const { resolutions = [] } = this.state.resolutions.find(r => r.id === issueId) || {};
        return resolutions;
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
                        initialValues={{
                            multiple: this.state.resolutions ? !!this.state.resolutions.find(r => r.resolutions.length > 1) : false,
                            'manual-resolution': undefined,
                            'selected-resolutions': {}
                        }}
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
