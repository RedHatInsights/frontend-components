import React, { Component } from 'react';

import propTypes from 'prop-types';

import {
    Form,
    Radio,
    Stack,
    StackItem
} from '@patternfly/react-core';

import IssueTable from './IssueTable';

const plural = (singular, plural) => n => {
    return n > 1 ? plural : singular;
};

const actions = plural('action', 'actions');
const allows = plural('allows', 'allow');
const these = plural('this', 'these');

const LABEL_RECOMMENDED = `Accept all recommended resolution steps for all actions. Some may require system reboot.
 You can disable automatic reboot in the next step or once the remediation is created.`;

function ResolutionModeStep (props) {
    const issueCount = props.state.resolutions.length;
    const tweakableCount = props.multiResolutionIssues.length;
    const LABEL_MANUAL = `Review and/or change resolution steps for ${these(tweakableCount)} ${tweakableCount} ${actions(tweakableCount)}`;

    return (
        <Stack gutter='sm'>
            <StackItem>
                <h1 className='ins-m-text__bold'>
                    You have selected { issueCount } { actions(issueCount) } to be added to your remediation.&nbsp;
                    { tweakableCount } out of { issueCount } { actions(issueCount) } { allows(tweakableCount) }&nbsp;
                    you to choose from multiple resolution steps.
                </h1>
            </StackItem>
            <StackItem>
                <Form>
                    <Radio
                        label={ LABEL_MANUAL }
                        aria-label={ LABEL_MANUAL }
                        id="manual"
                        name="radio"
                        defaultChecked={ props.state.manualResolutionSelection }
                        onChange={ () => props.onManualResolutionSwitch(true) }
                    />

                    <IssueTable issues={ props.multiResolutionIssues } state={ props.state } getResolution={ props.getResolution }/>

                    <Radio
                        label={ LABEL_RECOMMENDED }
                        aria-label={ LABEL_RECOMMENDED }
                        id="recommended"
                        name="radio"
                        defaultChecked={ !props.state.manualResolutionSelection }
                        onChange={ () => props.onManualResolutionSwitch(false) }
                    />
                </Form>
            </StackItem>
        </Stack>
    );
}

ResolutionModeStep.propTypes = {
    multiResolutionIssues: propTypes.array.isRequired,
    state: propTypes.object.isRequired,
    getResolution: propTypes.func.isRequired,
    onManualResolutionSwitch: propTypes.func.isRequired
};

export default ResolutionModeStep;
