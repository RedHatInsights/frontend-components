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
import { SELECTED_RESOLUTIONS } from '../utils';
import { RedoIcon, CloseIcon } from '@patternfly/react-icons';

const IssueResolution = (props) => {
    const { systems, resolutions, issue } = props;
    const formOptions = useFormApi();
    const [ issueResolutions, setIssueResolutions ] = useState([]);

    useEffect(() => {
        setIssueResolutions(resolutions.find(r => r.id === issue.id)?.resolutions || []);
    }, []);

    const pluralize = (count, str) => count > 1 ? str + 's' : str;

    return (
        <Stack hasGutter>
            <StackItem>
                <Title headingLevel="h2">
                    {`Choose action: ${issue.shortId}`}
                </Title>
            </StackItem>
            <StackItem>
                <TextContent>
                    <Text>
                        Review the possible resolution steps and select which to add to your playbook.
                    </Text>
                    <Text className="ins-c-remediations-action-description">
                        {issue.action}
                    </Text>
                    <Text className="ins-c-remediations-action-description">
                        {`Resolution affects ${systems.length} ${pluralize(systems.length, 'system')}`}
                    </Text>
                </TextContent>
            </StackItem>
            <StackItem>
                <div className="ins-c-resolution-container">
                    {
                        issueResolutions.map((resolution, index) => (
                            <div
                                className="ins-c-resolution-option"
                                sm={12}
                                md={6}
                                lg={4}
                                xl={3}
                                key={ resolution.id }>
                                <Tile
                                    onClick={() => formOptions.change(SELECTED_RESOLUTIONS, {
                                        ...formOptions.getState().values[SELECTED_RESOLUTIONS],
                                        [issue.id]: resolution.id
                                    })}
                                    isSelected={
                                        formOptions.getState().values[SELECTED_RESOLUTIONS][issue.id] ?
                                            formOptions.getState().values[SELECTED_RESOLUTIONS][issue.id] === resolution.id
                                            : index === 0
                                    }
                                    title={resolution.description}
                                >
                                    <TextContent className="pf-u-pt-sm">
                                        <Text className="pf-u-mb-sm ins-c-playbook-description">
                                            Resolution from &quot;{issue.id.split(/:|\|/)[1]}&quot;
                                        </Text>
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
    systems: propTypes.arrayOf(propTypes.string).isRequired,
    issue: propTypes.shape({
        id: propTypes.string,
        shortId: propTypes.string,
        action: propTypes.string,
        alternate: propTypes.number,
        systemsCount: propTypes.number
    }).isRequired,
    resolutions: propTypes.arrayOf(propTypes.shape({
        id: propTypes.string,
        resolutions: propTypes.array
    })).isRequired
};

export default IssueResolution;
