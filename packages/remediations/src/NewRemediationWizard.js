import React, { Component, Fragment } from 'react';
import keyBy from 'lodash/keyBy';
import transform from 'lodash/transform';
import FormRenderer from '@data-driven-forms/react-form-renderer/dist/esm/form-renderer';
import Pf4FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/esm/form-template';
import schemaBuilder from './schema';
import { remediationUrl } from './utils';
import * as api from './api';
import Deferred from '@redhat-cloud-services/frontend-components-utilities/files/Deffered';
import Wizard from '@data-driven-forms/pf4-component-mapper/dist/esm/wizard';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/esm/component-types';
import SelectPlaybook from './newSteps/selectPlaybook';
import ReviewActions from './newSteps/reviewActions';
import IssueResolution from './newSteps/issueResolution';
import FetchError from './newSteps/fetchError';
import Review from './newSteps/review';

function createNotification (id, name, isNewSwitch) {
    const verb = isNewSwitch ? 'created' : 'updated';

    return {
        variant: 'success',
        title: `Playbook ${verb}`,
        description: <span>You have successfully { isNewSwitch ? 'created' : 'updated' } <a href={ remediationUrl(id) } >{ name }</a>.</span>,
        dismissable: true
    };
}

class RemediationWizard extends Component {

    state = {
        open: false,
        schema: {},
        errors: []
    }

    constructor() {
        super();
        this.container = React.createRef(document.createElement('div'));
    }

    setOpen = open => {
        this.setState({ open });
    }

    getFormTemplate = (props) => <Pf4FormTemplate {...props} showFormControls={false} />;

    getIssues = (data, issuesById, getResolution) =>
        data.issues.map(issue => {
            const resolutions = getResolution(issue.id);
            const { description, needs_reboot: needsReboot  } = resolutions?.[0] || {};
            return {
                action: issuesById[issue.id].description,
                resolution: description,
                needsReboot,
                systemsCount: issue.systems ? issue.systems.length : data.systems.length,
                id: issue.id,
                shortId: issue?.id?.split('|')?.slice(-1)?.[0] || issue.id,
                alternate: resolutions.length - 1
            };
        });

    openWizard = (data, basePath) => {
        const deferred = new Deferred();
        const issuesById = keyBy(data.issues, issue => issue.id);

        this.loadResolutions(data.issues).then(
            (values) => {
                this.setState(values);
                const issuesMultiple = this.getIssues(data, issuesById, this.getResolution).filter(record => record.alternate > 1);
                this.setState({
                    open: true,
                    data,
                    deferred,
                    basePath,
                    onRemediationCreated: data.onRemediationCreated,
                    schema: schemaBuilder(this.container.current, issuesMultiple),

                    mapperExtension: {
                        'select-playbook': {
                            component: this.state.errors.length > 0 ? FetchError : SelectPlaybook,
                            SelectPlaybookProps: {
                                issues: data.issues,
                                systems: data.systems
                            }
                        },
                        'review-actions': {
                            component: ReviewActions,
                            issues: data.issues,
                            issuesMultiple
                        },
                        'issue-resolution': {
                            component: IssueResolution,
                            systems: data.systems,
                            getResolution: this.getResolution
                        },
                        review: {
                            component: Review,
                            data: data,
                            issuesById,
                            getIssues: this.getIssues,
                            resolutions: this.state.resolutions
                        }
                    }
                });
            }
        );

        return deferred.promise;
    }

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

    getResolution = issueId => this.state.resolutions.find(r => r.id === issueId)?.resolutions || [];

    resolver = () => (id, name, isNewSwitch) => (
        this.state.onRemediationCreated({
            remediation: { id, name },
            getNotification: () => createNotification(id, name, isNewSwitch)
        })
    );

    render () {

        return (
            this.state.open ?
                <FormRenderer
                    schema={this.state.schema}
                    container={this.container}
                    subscription={{ values: true }}
                    FormTemplate={this.getFormTemplate}
                    initialValues={{
                        multiple: !!this.state.resolutions?.find(r => r.resolutions.length > 1),
                        'manual-resolution': true,
                        'selected-resolutions': {}
                    }}
                    componentMapper={{
                        [componentTypes.WIZARD]: Wizard,
                        ...this.state.mapperExtension
                    }}
                    onSubmit={(_, formOptions) => {
                        const values = formOptions.getState().values;
                        const issues = this.state.data.issues.map(({ id }) => ({
                            id,
                            resolution: values['manual-resolution'] ? this.getResolution(id)?.[0]?.id : undefined,
                            systems: this.state.data.systems
                        }));
                        const add = { issues, systems: this.state.data.systems };
                        if (values['existing-playbook-selected']) {
                            const { id, name } = values['existing-playbook'];
                            // eslint-disable-next-line camelcase
                            api.patchRemediation(id, { add, auto_reboot: values['auto-reboot'] }, this.state.basePath)
                            .then(() => this.resolver(this.state.deferred)(id, name, false));
                        } else {
                            // eslint-disable-next-line camelcase
                            api.createRemediation({ name: values['select-playbook'], add, auto_reboot: values['auto-reboot'] }, this.state.basePath)
                            .then(({ id }) => this.resolver(this.state.deferred)(id, values['select-playbook'], true));
                        }

                        this.setOpen(false);
                    }}
                    onCancel={this.closeWizard}
                />
                : <Fragment/>
        );
    }
}

export default RemediationWizard;
