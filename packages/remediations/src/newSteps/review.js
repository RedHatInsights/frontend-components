import React, { useState, Fragment, useEffect } from 'react';
import propTypes from 'prop-types';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/esm/use-form-api';
import {
    Button,
    Text,
    TextContent,
    Stack,
    StackItem
} from '@patternfly/react-core';
import {
    AUTO_REBOOT,
    SELECT_PLAYBOOK,
    SELECTED_RESOLUTIONS,
    EXISTING_PLAYBOOK_SELECTED,
    EXISTING_PLAYBOOK,
    MANUAL_RESOLUTION
} from '../utils';
import { Table, TableVariant, TableHeader, TableBody, sortable } from '@patternfly/react-table';
import { CloseIcon, ExclamationTriangleIcon, RedoIcon } from '@patternfly/react-icons';
import './review.scss';

const Review = (props) => {
    const { data, issuesById, getIssues, resolutions } = props;
    const formOptions = useFormApi();
    const [ sortByState, setSortByState ] = useState({ index: undefined, direction: undefined });

    const selectedPlaybook = formOptions.getState().values[EXISTING_PLAYBOOK];

    useEffect(() => {
        formOptions.change(AUTO_REBOOT, formOptions.getState().values[EXISTING_PLAYBOOK_SELECTED] && selectedPlaybook.auto_reboot);
    }, []);

    const getResolution = issueId => {
        const allResolutions = resolutions.find(r => r.id === issueId)?.resolutions || [];

        if (formOptions.getState().values[MANUAL_RESOLUTION] && issueId in formOptions.getState().values[SELECTED_RESOLUTIONS]) {
            return allResolutions.filter(r => r.id === formOptions.getState().values[SELECTED_RESOLUTIONS][issueId]);
        }

        if (formOptions.getState().values[EXISTING_PLAYBOOK_SELECTED]) {
            const existing = selectedPlaybook?.issues?.find(i => i.id === issueId);

            if (existing) {
                return allResolutions.filter(r => r.id === existing.resolution.id);
            }
        }

        return allResolutions;
    };

    const records = getIssues(data, issuesById, getResolution);

    const sortedRecords = records.sort(
        (a, b) => {
            const key = Object.keys(a)[sortByState.index];
            return (
                (a[key] > b[key] ? 1 :
                    a[key] < b[key] ? -1 : 0)
                * (sortByState.direction === 'desc' ? -1 : 1)
            );
        }
    );

    const rows = sortedRecords.map((record, index) => ({
        cells: [
            record.action,
            <Fragment key={`${index}-description`}>
                <p key={`${index}-resolution`}>
                    {record.resolution}
                </p>
                {record.alternate > 0 &&
                    (
                        <p key={`${index}-alternate`}>{record.alternate} alternate resolution</p>
                    )}
            </Fragment>,
            {
                title: record.needsReboot ? <Fragment><RedoIcon/>{' Yes'}</Fragment> : <Fragment><CloseIcon/>{' No'}</Fragment>,
                value: record.needsReboot
            },
            record.systemsCount
        ]
    }));

    const onSort = (event, index, direction) => setSortByState({ index, direction });

    return (
        <Stack hasGutter>
            <StackItem>
                <TextContent>
                    <Text>
                        Issues listed below will be added to the playbook <b>{formOptions.getState().values[SELECT_PLAYBOOK]}</b>.
                    </Text>
                </TextContent>
            </StackItem>
            { records.some(r => r.needsReboot) && <StackItem>
                <TextContent>
                    <Text className='ins-c-playbook-reboot-required'>
                        <ExclamationTriangleIcon /> A system reboot is required to remediate selected issues
                    </Text>
                </TextContent>
            </StackItem>}
            <StackItem>
                <TextContent>
                    <Text>
                        The playbook <b>{formOptions.getState().values[SELECT_PLAYBOOK]}</b>
                        { formOptions.getState().values[AUTO_REBOOT] ?
                            ' does' :
                            <span className="ins-c-remediation-danger-text"> does not</span>
                        } auto reboot systems.
                    </Text>
                </TextContent>
            </StackItem>
            <StackItem>
                <Button
                    variant="link"
                    isInline
                    onClick={ () => formOptions.change(AUTO_REBOOT, !formOptions.getState().values[AUTO_REBOOT]) }
                >
                    Turn {formOptions.getState().values[AUTO_REBOOT] ? 'off' : 'on'} autoreboot
                </Button>
            </StackItem>
            <Table
                aria-label='Actions'
                className='ins-c-remediation-summary-table'
                variant={ TableVariant.compact }
                cells={ [
                    {
                        title: 'Action',
                        transforms: [ sortable ]
                    }, {
                        title: 'Resolution',
                        transforms: [ sortable ]
                    }, {
                        title: 'Reboot required',
                        transforms: [ sortable ]
                    }, {
                        title: 'Systems',
                        transforms: [ sortable ]
                    }]
                }
                rows={ rows }
                onSort={ onSort }
                sortBy={ sortByState }
            >
                <TableHeader />
                <TableBody />
            </Table>
        </Stack >
    );
};

Review.propTypes = {
    data: propTypes.shape({
        issues: propTypes.array,
        systems: propTypes.array,
        onRemediationCreated: propTypes.func
    }).isRequired,
    issuesById: propTypes.shape({
        [propTypes.string]: propTypes.shape({
            id: propTypes.string,
            description: propTypes.string
        })
    }).isRequired,
    getIssues: propTypes.func.isRequired,
    resolutions: propTypes.arrayOf(propTypes.shape({
        id: propTypes.string,
        resolutions: propTypes.array
    })).isRequired
};

export default Review;
