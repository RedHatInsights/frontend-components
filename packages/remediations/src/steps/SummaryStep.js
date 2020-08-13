import React, { Component } from 'react';

import propTypes from 'prop-types';

import {
    Switch,
    Stack,
    StackItem
} from '@patternfly/react-core';

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

    const { name } = props.state;
    const rebootNeeded = isRebootNeeded(props.state, props.getResolution);

    return (
        <Stack gutter='sm'>
            <StackItem><h1 className='ins-m-text__bold'>Playbook name: { name || 'Unnamed Playbook' }</h1></StackItem>
            <StackItem>
                <IssueTable issues={ props.state.open.data.issues } state={ props.state } getResolution={ props.getResolution } />
            </StackItem>
            <StackItem>
                <Stack gutter='sm'>
                    {
                        rebootNeeded ?
                            <StackItem><h1 className='ins-m-text__bold'>System reboot is required</h1></StackItem> :
                            <StackItem><h1 className='ins-m-text__accent'>System reboot is not required</h1></StackItem>
                    }
                    <StackItem>
                        <Switch
                            id="autoReboot"
                            aria-label="Auto reboot"
                            label="Auto reboot"
                            isChecked={ rebootNeeded ? isAutoReboot(props.state) : false }
                            isDisabled={ !rebootNeeded }
                            onChange={ value => props.onAutoRebootSwitch(value) }
                        />
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
