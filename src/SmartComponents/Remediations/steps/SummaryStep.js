import React, { Component } from 'react';

import propTypes from 'prop-types';

import {
    Switch,
    Stack,
    StackItem
} from '@patternfly/react-core';
import { RebootingIcon } from '@patternfly/react-icons';

import IssueTable from './IssueTable';

function isRebootNeeded (state, getResolution) {
    if (state.open.data.issues.some(issue => getResolution(issue.id).needs_reboot)) {
        return true;
    }

    if (state.selectedRemediation && state.selectedRemediation.needs_reboot) {
        return true;
    }

    return false;
}

function isAutoReboot (state) {
    if (state.autoRebootSwitch !== undefined) {
        return state.autoRebootSwitch;
    }

    if (state.selectedRemediation && !state.selectedRemediation.auto_reboot) {
        return false;
    }

    return true;
}

function SummaryStep(props) {

    const { autoRebootSwitch, autoRebootSwitchDisabled } = props.state;
    const rebootNeeded = isRebootNeeded(props.state, props.getResolution);

    return (
        <Stack gutter='sm'>
            <StackItem><h1 className='ins-m-text__bold'>Remediation summary</h1></StackItem>
            <StackItem>
                <IssueTable issues={ props.state.open.data.issues } state={ props.state } getResolution={ props.getResolution } />
            </StackItem>
            <StackItem>
                <Stack gutter='sm'>
                    <StackItem>
                        <Switch
                            id="autoReboot"
                            aria-label="Auto Reboot"
                            label="Auto Reboot"
                            isChecked={ rebootNeeded ? isAutoReboot(props.state) : false }
                            isDisabled={ !rebootNeeded }
                            onChange={ value => props.onAutoRebootSwitch(value) }
                        />
                    </StackItem>
                    <StackItem className='ins-m-text__accent'>
                        {
                            rebootNeeded ? <h1>System reboot is required</h1> : <h1>The remediation does not require reboot</h1>
                        }
                    </StackItem>
                </Stack>
            </StackItem>
        </Stack>
    );
}

SummaryStep.propTypes = {
    state: propTypes.object.isRequired,
    getResolution: propTypes.func.isRequired,
    onAutoRebootSwitch: propTypes.func.isRequired
};

export default SummaryStep;
