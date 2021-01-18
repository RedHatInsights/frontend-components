import React, { useState, Fragment, useEffect } from 'react';
import propTypes from 'prop-types';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/esm/use-form-api';
import {
    Text,
    TextContent,
    Stack,
    StackItem
} from '@patternfly/react-core';
import { Table, TableVariant, TableHeader, TableBody, sortable } from '@patternfly/react-table';
import { CloseIcon, ExclamationTriangleIcon, RedoIcon } from '@patternfly/react-icons';
import { Button } from '@patternfly/react-core/dist/esm/components/Button/Button';
import './review.scss';

const Review = (props) => {
    const { data, issuesById, getIssues, resolutions } = props;
    const formOptions = useFormApi();
    const [ sortByState, setSortByState ] = useState({ index: undefined, direction: undefined });

    const selectedPlaybook = formOptions.getState().values['existing-playbook'];

    useEffect(() => {
        formOptions.change('auto-reboot', formOptions.getState().values['existing-playbook-selected'] && selectedPlaybook.auto_reboot);
    }, []);

    const getResolution = issueId => {
        const allResolutions = resolutions.find(r => r.id === issueId)?.resolutions || [];

        if (allResolutions.length > 1)  {
            if (formOptions.getState().values['manual-resolution'] && issueId in formOptions.getState().values['selected-resolutions']) {
                return allResolutions.filter(r => r.id === formOptions.getState().values['selected-resolutions'][issueId]);
            }

            if (formOptions.getState().values['existing-playbook-selected']) {
                const existing = selectedPlaybook?.issues?.find(i => i.id === issueId);

                if (existing) {
                    return allResolutions.filter(r => r.id === existing.resolution.id);
                }
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
                        Issues listed below will be added to the playbook <b>{formOptions.getState().values['select-playbook']}</b>.
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
                        The playbook <b>{formOptions.getState().values['select-playbook']}</b>
                        { formOptions.getState().values['auto-reboot'] ?
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
                    onClick={ () => formOptions.change('auto-reboot', !formOptions.getState().values['auto-reboot']) }
                >
                    Turn {formOptions.getState().values['auto-reboot'] ? 'off' : 'on'} autoreboot
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
    data: propTypes.object,
    issuesById: propTypes.object,
    getIssues: propTypes.func,
    resolutions: propTypes.array
};

export default Review;
