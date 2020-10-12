import React from 'react';

import propTypes from 'prop-types';

import {
    Stack,
    StackItem,
    TextContent,
    Text,
    Tile
} from '@patternfly/react-core';

import './IssueResolutionStep.scss';

function isSelectedByDefault ({ id }, index, issue, state) {
    const selected = state.selectedResolutions[issue.id];

    if (selected) {
        return selected === id;
    }

    return index === 0;
}

function IssueResolutionStep (props) {
    const systems = props.state.open.data.systems.length;
    return (
        <Stack hasGutter>
            <StackItem>
                <TextContent>
                    <Text component="h3">
                        Playbook name: {props.state.name}
                    </Text>
                    <Text component="p">
                        Review the possible resolution steps and select which to add to your playbook.
                    </Text>
                    <Text component="h3">
                        { props.state.issuesById[props.issue.id].description }
                    </Text>
                    <Text component="p">
                        Resolution affects {systems} {systems === 1 ? 'system' : 'systems'}.
                    </Text>
                </TextContent>
            </StackItem>
            <StackItem>
                <div className="ins-c-resolution-container">
                    {
                        props.issue.resolutions.map((resolution, i) => (
                            <div
                                className="ins-c-resolution-option"
                                sm={12}
                                md={6}
                                lg={4}
                                xl={3}
                                key={ resolution.id }>
                                <Tile
                                    onClick={() => props.onResolutionSwitch(props.issue.id, resolution.id)}
                                    isSelected={isSelectedByDefault(resolution, i, props.issue, props.state)}
                                    title={resolution.description}
                                >
                                    <TextContent className="pf-u-pt-md">
                                        {
                                            <Text className={resolution.needs_reboot ? 'ins-c-reboot-required' : ''} component="p" >
                                                {resolution.needs_reboot ? (<b>Reboot required</b>) : 'Reboot not required'}
                                            </Text>
                                        }
                                    </TextContent>

                                </Tile>

                            </div>
                        ))
                    }
                </div>
            </StackItem>
        </Stack>
    );
}

IssueResolutionStep.propTypes = {
    issue: propTypes.object.isRequired,
    state: propTypes.object.isRequired,
    onResolutionSwitch: propTypes.func.isRequired
};

export default IssueResolutionStep;
