import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/esm/use-form-api';
import './issueResolution.scss';
import {
    Text,
    TextContent,
    Stack,
    StackItem,
    Tile,
    Title
} from '@patternfly/react-core';
import { RedoIcon, CloseIcon } from '@patternfly/react-icons';

const IssueResolution = (props) => {
    const { systems, issuesById, getResolution, issue } = props;
    const formOptions = useFormApi();
    const [ resolutions, setResolutions ] = useState([]);

    useEffect(() => {
        setResolutions(getResolution(issue.id));
    }, []);

    const pluralize = (count, str) => count > 1 ? str + 's' : str;

    return (
        <Stack hasGutter>
            <StackItem>
                <Title headingLevel="h2">
                    {`Choose action: ${issue.action}`}
                </Title>
            </StackItem>
            <StackItem>
                <TextContent>
                    <Text>
                        Review the possible resolution steps and select which to add to your playbook.
                    </Text>
                    <Text className="ins-c-remediations-action-description">
                        {issuesById[issue.id].description}
                    </Text>
                    <Text className="ins-c-remediations-action-description">
                        {`Resolution affects ${systems.length} ${pluralize(systems.length, 'system')}`}
                    </Text>
                </TextContent>
            </StackItem>
            <StackItem>
                <div className="ins-c-resolution-container">
                    {
                        resolutions.map((resolution, index) => (
                            <div
                                className="ins-c-resolution-option"
                                sm={12}
                                md={6}
                                lg={4}
                                xl={3}
                                key={ resolution.id }>
                                <Tile
                                    onClick={() => formOptions.change('selected-resolutions', {
                                        ...formOptions.getState().values['selected-resolutions'],
                                        [issue.id]: resolution.id
                                    })}
                                    isSelected={
                                        formOptions.getState().values['selected-resolutions'][issue.id] ?
                                            formOptions.getState().values['selected-resolutions'][issue.id] === resolution.id
                                            : index === 0
                                    }
                                    title={resolution.description}
                                >
                                    <TextContent className="pf-u-pt-md">
                                        {
                                            <div className="ins-c-reboot-required">
                                                {resolution.needs_reboot ? <RedoIcon/> : <CloseIcon/>}
                                                <Text component="span" >
                                                    {resolution.needs_reboot ? 'Reboot required' : (<span>Reboot <b>not</b> required</span>)}
                                                </Text>
                                            </div>
                                        }
                                    </TextContent>
                                </Tile>

                            </div>
                        ))
                    }
                </div>
            </StackItem>
        </Stack >
    );
};

IssueResolution.propTypes = {
    systems: propTypes.array,
    issuesById: propTypes.object,
    issue: propTypes.object,
    getResolution: propTypes.func
};

export default IssueResolution;

