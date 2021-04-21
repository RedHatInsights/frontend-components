import React, { Fragment } from 'react';
import propTypes from 'prop-types';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/esm/use-form-api';
import './issueResolution.scss';
import {
    Text,
    TextContent,
    Stack,
    StackItem,
    Tile,
    Title,
    Alert,
    Popover,
    Button
} from '@patternfly/react-core';
import { pluralize, RESOLUTIONS, SELECTED_RESOLUTIONS, SYSTEMS } from '../utils';
import { RedoIcon, CloseIcon } from '@patternfly/react-icons';
import uniqBy from 'lodash/uniqBy';
import differenceWith from 'lodash/differenceWith';
import isEqual from 'lodash/isEqual';

const IssueResolution = ({ issue }) => {
    const formOptions = useFormApi();
    const resolutions = formOptions.getState().values[RESOLUTIONS];
    const systems = formOptions.getState().values[SYSTEMS];

    const issueResolutions = resolutions.find(r => r.id === issue.id)?.resolutions || [];
    const uniqueResolutions = uniqBy(issueResolutions, 'id');
    const removedResolutions = differenceWith(issueResolutions, uniqueResolutions, isEqual);

    return (
        <Stack hasGutter>
            <StackItem>
                <Title headingLevel="h2">
                    {`Choose action: ${issue.shortId}`}
                </Title>
            </StackItem>
            <StackItem>
                {removedResolutions.length > 0 && (
                    <StackItem className="pf-u-mb-sm">
                        <Alert variant="warning" isInline title={
                            <Text>
                                There {pluralize(removedResolutions.length, 'was', 'were')} <Popover
                                    aria-label="Resolution duplicates popover"
                                    bodyContent={<Fragment>
                                        {removedResolutions.map((resolution, key) => <div key={key}>{resolution.description}</div>)}
                                    </Fragment>}
                                >
                                    <b><Button variant="link" isInline>{removedResolutions.length}</Button> {pluralize(removedResolutions.length, 'resolution')}</b>
                                </Popover> removed due to duplication</Text>} />
                    </StackItem>
                )}
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
                        uniqueResolutions.map((resolution, index) => (
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
    issue: propTypes.shape({
        id: propTypes.string,
        shortId: propTypes.string,
        action: propTypes.string,
        alternate: propTypes.number,
        systemsCount: propTypes.number
    }).isRequired
};

export default IssueResolution;
