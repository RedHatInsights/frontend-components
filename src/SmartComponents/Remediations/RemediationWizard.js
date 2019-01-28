import React, { Component } from 'react';
import keyBy from 'lodash/keyBy';
import transform from 'lodash/transform';

import * as api from '../../api/remediations';
import { Wizard } from '../../PresentationalComponents/Wizard';
import Deferred from '../../Utilities/Deferred';
import { remediationUrl } from './utils';

import ExistingOrNew from './steps/ExistingOrNew';
import ResolutionModeStep from './steps/ResolutionModeStep';
import IssueResolutionStep from './steps/IssueResolutionStep';
import SummaryStep from './steps/SummaryStep';
import LoadingStep from './steps/LoadingStep';
import ErrorStep from './steps/ErrorStep';

import './RemediationWizard.scss';

let mountedInstance = false;

export function getMountedInstance () {
    return mountedInstance;
}

function createNotification (id, name, isNewSwitch) {
    const verb = isNewSwitch ? 'created' : 'updated';

    return {
        variant: 'success',
        title: `Remediation ${verb}`,
        description: <span><a href={ remediationUrl(id) } >{ name }</a> has been { verb }</span>,
        dismissDelay: 8000
    };
}

/* eslint camelcase: off */
class RemediationWizard extends Component {

    constructor (props) {
        super(props);
        this.setState = this.setState.bind(this);
        this.state = {
            open: false
        };
    };

    setOpen = open => {
        this.setState({ open });
    }

    openWizard = (data, basePath) => {
        const deferred = new Deferred();
        const issuesById = keyBy(data.issues, issue => issue.id);

        this.setState({
            open: {
                deferred,
                data,
                basePath
            },

            issuesById,

            isNewSwitch: true,
            name: '',
            existingRemediations: false,
            selectedRemediationId: false,
            selectedRemediation: false,

            resolutions: false,
            manualResolutionSelection: true,
            selectedResolutions: {},

            errors: []
        });

        this.loadRemediations();
        this.loadResolutions(data.issues);

        return deferred.promise;
    }

    loadRemediations = async () => {
        const { remediations: existingRemediations } = await api.getRemediations();
        this.setState({ existingRemediations });
    }

    loadResolutions = async (issues) => {
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
    }

    closeWizard = submitted => {
        const open = this.state.open;

        if (!open) {
            throw new Error('Wizard no longer mounted!');
        }

        if (submitted) {
            if (!this.resolutionsLoaded() || this.state.errors.length) {
                return false; // the wizard is not finished properly - do not let user submit it just yet
            }

            const { isNewSwitch, manualResolutionSelection } = this.state;
            const { systems } = this.state.open.data;
            const issues = this.state.open.data.issues.map(({ id }) => ({
                id,
                resolution: manualResolutionSelection ? this.getResolution(id).id : undefined
            }));

            (isNewSwitch ? this.createRemediation : this.updateRemediation)({ issues, systems }, this.resolver(open.deferred));
        } else {
            open.deferred.resolve(false);
        }

        this.setOpen(false);
    }

    createRemediation = (add, resolver) => {
        const name = this.state.name || 'Unnamed remediation';

        return api.createRemediation({ name, add, auto_reboot: this.state.autoRebootSwitch }, this.state.open.basePath)
        .then(({ id }) => resolver(id, name, true));
    };

    updateRemediation = (add, resolver) => {
        const { id, name } = this.state.selectedRemediation;

        return api.patchRemediation(id, { add, auto_reboot: this.state.autoRebootSwitch }, this.state.open.basePath)
        .then(() => resolver(id, name, false));
    };

    resolver = deferred => (id, name, isNewSwitch) => {
        deferred.resolve({
            remediation: { id, name },
            getNotification: () => createNotification(id, name, isNewSwitch)
        });
    };

    componentDidMount () {
        mountedInstance = this;
    }

    componentWillUnmount () {
        mountedInstance = false;
    }

    /*
     * Accessing state
     */
    getMultiResolutionIssues = () => {
        return (this.state.resolutions || []).filter(issue => {
            if (issue.resolutions.length > 1) {
                if (this.state.selectedRemediation) {
                    // if this issue is already part of the remediation we are adding into
                    // let's not ask user about it again
                    return !this.state.selectedRemediation.issues.some(i => i.id === issue.id);
                }

                return true;
            }

            return false;
        });
    }

    resolutionsLoaded = () => {
        return this.state.resolutions !== false;
    }

    selectedRemediationLoaded = () => {
        return this.state.selectedRemediationId ? this.state.selectedRemediation : true;
    }

    getResolution = issueId => {
        const resolutions = this.state.resolutions.find(r => r.id === issueId);

        if (resolutions.resolutions.length > 1)  {
            if (this.state.manualResolutionSelection && issueId in this.state.selectedResolutions) {
                return resolutions.resolutions.find(r => r.id === this.state.selectedResolutions[issueId]);
            }

            if (this.state.selectedRemediationId) {
                const existing = this.state.selectedRemediation.issues.find(i => i.id === issueId);

                if (existing) {
                    return resolutions.resolutions.find(r => r.id === existing.resolution.id);
                }
            }
        }

        return resolutions.resolutions[0];
    }

    /*
     * State manipulation
     */
    onNameChange = name => this.setState({ name });

    onIsNewSwitch = isNewSwitch => this.setState({
        isNewSwitch,
        selectedRemediation: this.onRemediationSelected(isNewSwitch ? false : this.state.existingRemediations[0].id)
    });

    onRemediationSelected = id => {
        this.setState({ selectedRemediationId: id, selectedRemediation: false });
        if (id) {
            api.getRemediation(id).then(remediation => {
                if (remediation.id === this.state.selectedRemediationId) {
                    this.setState({ selectedRemediation: remediation });
                }
            });
        }
    };

    onManualResolutionSwitch = manualResolutionSelection => this.setState({ manualResolutionSelection });
    onAutoRebootSwitch = autoRebootSwitch => this.setState({ autoRebootSwitch });
    onResolutionSwitch = (issueId, resolutionId) => this.setState({
        selectedResolutions: {
            ...this.state.selectedResolutions,
            [issueId]: resolutionId
        }
    });

    buildSteps = () => {
        if (!this.state.open) {
            return [];
        }

        const steps = [
            <ExistingOrNew
                key='RemediationNameStep'
                state={ this.state }
                onNameChange={ this.onNameChange }
                onIsNewSwitch={ this.onIsNewSwitch }
                onRemediationSelected={ this.onRemediationSelected }
            />
        ];

        if (!this.resolutionsLoaded() || !this.selectedRemediationLoaded()) {
            steps.push(<LoadingStep key='LoadingStep'/>);
            return steps;
        }

        // no valid resolutions
        if (this.state.errors.length) {
            steps.push(<ErrorStep key='ErrorStep' errors={ this.state.errors }/>);
            return steps;
        }

        const multiResolutionIssues = this.getMultiResolutionIssues();

        if (multiResolutionIssues.length) {
            steps.push(
                <ResolutionModeStep
                    key='ResolutionModeStep'
                    multiResolutionIssues={ multiResolutionIssues }
                    getResolution={ this.getResolution }
                    state={ this.state }
                    onManualResolutionSwitch={ this.onManualResolutionSwitch }
                />
            );
        }

        if (this.state.manualResolutionSelection) {
            steps.push(...multiResolutionIssues.map(issue =>
                <IssueResolutionStep key={ issue.id } issue={ issue } state={ this.state } onResolutionSwitch={ this.onResolutionSwitch } />
            ));
        }

        steps.push(
            <SummaryStep
                key='SummaryStep'
                state={ this.state }
                getResolution={ this.getResolution }
                onAutoRebootSwitch={ this.onAutoRebootSwitch }
            />
        );

        return steps;
    }

    render () {
        const steps = this.buildSteps();

        return (
            <Wizard
                isLarge = { true }
                title="Remediate with Ansible"
                className='ins-c-remediation-modal'
                onClose = { this.closeWizard }
                isOpen= { this.state.open !== false }
                content = { steps }
            />
        );
    }
}

export default RemediationWizard;
