import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as api from '../../api/remediations';
import { Wizard } from '../../PresentationalComponents/Wizard';
import Deferred from '../../Utilities/Deferred';

import ExistingOrNew from './steps/ExistingOrNew';

import './RemediationWizard.scss';

let mountedInstance = false;

export function getMountedInstance () {
    return mountedInstance;
}

function createRemediation (name, add, basePath) {
    return api.createRemediation({
        name: name || 'Unnamed remediation',
        add
    }, basePath);
}

function updateRemediation (id, add, basePath) {
    return api.updateRemediation(id, {
        add
    }, basePath);
}

function createNotification (name, isNewSwitch) {
    const verb = isNewSwitch ? 'created' : 'updated';
    return {
        variant: 'success',
        title: `Remediation ${verb}`,
        description: `Remediation ${name} has been ${verb}`,
        dismissDelay: 8000
    };
}

class RemediationWizard extends Component {

    constructor (props) {
        super(props);
        this.state = {
            open: false
        };
    };

    setOpen = open => {
        this.setState({ open });
    }

    openWizard = (data, basePath) => {
        const deferred = new Deferred();
        this.setState({
            open: {
                deferred,
                data,
                basePath
            },

            isNewSwitch: true,
            name: '',
            existingRemediations: false,
            selectedRemediation: false
        });

        this.loadRemediations();

        return deferred.promise;
    }

    loadRemediations = async () => {
        const { remediations: existingRemediations } = await api.getRemediations();
        this.setState({ existingRemediations });
    }

    closeWizard = submitted => {
        const open = this.state.open;

        if (!open) {
            throw new Error('Wizard no longer mounted!');
        }

        if (submitted) {
            const { isNewSwitch } = this.state;
            const { issues, systems } = this.state.open.data;

            (isNewSwitch ? this.createRemediation : this.updateRemediation)({ issues, systems }, this.resolver(open.deferred));
        } else {
            open.deferred.resolve(false);
        }

        this.setOpen(false);
    }

    createRemediation = (add, resolver) => {
        const name = this.state.name || 'Unnamed remediation';

        return api.createRemediation({ name, add }, this.state.open.basePath)
        .then(({ id }) => resolver(id, name, true));
    };

    updateRemediation = (add, resolver) => {
        const { id, name } = this.state.selectedRemediation;

        return api.patchRemediation(id, { add }, this.state.open.basePath)
        .then(() => resolver(id, name, false));
    };

    resolver = deferred => (id, name, isNewSwitch) => {
        deferred.resolve({
            remediation: { id, name },
            getNotification: () => createNotification(name, isNewSwitch)
        });
    };

    componentDidMount () {
        mountedInstance = this;
    }

    componentWillUnmount () {
        mountedInstance = false;
    }

    render() {
        const steps = [
            <ExistingOrNew key='RemediationNameStep' state={ this.state } setState={ value => this.setState(value) }/>
        ];

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
