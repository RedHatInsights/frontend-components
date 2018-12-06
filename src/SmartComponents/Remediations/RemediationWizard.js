import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as api from '../../api/remediations';
import { Wizard } from '../../PresentationalComponents/Wizard';
import Deferred from '../../Utilities/Deferred';

import NameStep from './steps/Name';

import './RemediationWizard.scss';

let mountedInstance = false;

export function getMountedInstance () {
    return mountedInstance;
}

function createRemediation (name, { issues, systems }, basePath) {
    return api.createRemediation({
        name: name || 'Unnamed remediation',
        add: {
            issues,
            systems
        }
    }, basePath);
}

function createNotification (remediation) {
    return {
        variant: 'success',
        title: 'Remediation created',
        description: `Remediation ${remediation.name} has been created`,
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
        this.setOpen({
            deferred,
            data,
            basePath
        });
        return deferred.promise;
    }

    closeWizard = submitted => {
        const open = this.state.open;

        if (!open) {
            throw new Error('Wizard no longer mounted!');
        }

        if (submitted) {
            createRemediation(this.remediationNameStep.state.value, open.data, open.basePath).then(remediation => open.deferred.resolve({
                remediation,
                getNotification: () => createNotification(remediation)
            }));
        } else {
            open.deferred.resolve(false);
        }

        this.setOpen(false);
    }

    componentDidMount () {
        mountedInstance = this;
    }

    componentWillUnmount () {
        mountedInstance = false;
    }

    render() {
        const steps = [
            <NameStep key='RemediationNameStep' ref={ ref => this.remediationNameStep = ref }/>
        ];

        return (
            <Wizard
                isLarge = { true }
                title="Create Remediation"
                className='ins-c-remediation-modal'
                onClose = { this.closeWizard }
                isOpen= { this.state.open !== false }
                content = { steps }
            />
        );
    }
}

export default RemediationWizard;
