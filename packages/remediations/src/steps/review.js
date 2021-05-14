import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import useFieldApi from '@data-driven-forms/react-form-renderer/dist/esm/use-field-api';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/esm/use-form-api';
import { Table, TableVariant, TableHeader, TableBody, sortable } from '@patternfly/react-table';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import {
    Button,
    Text,
    TextContent,
    Stack,
    StackItem
} from '@patternfly/react-core';
import {
    buildRows,
    getResolution,
    EXISTING_PLAYBOOK,
    EXISTING_PLAYBOOK_SELECTED,
    SELECT_PLAYBOOK,
    SYSTEMS
} from '../utils';
import './review.scss';

const Review = (props) => {
    const { data, issuesById } = props;
    const { input } = useFieldApi(props);
    const formOptions = useFormApi();
    const [ sortByState, setSortByState ] = useState({ index: undefined, direction: undefined });

    const selectedPlaybook = formOptions.getState().values[EXISTING_PLAYBOOK];
    const existingPlaybookSelected = formOptions.getState().values[EXISTING_PLAYBOOK_SELECTED];

    const records = data.issues.map(issue => {
        const issueResolutions = getResolution(issue.id, formOptions.getState().values);
        const { description, needs_reboot: needsReboot  } = issueResolutions?.[0] || {};
        return {
            action: issuesById[issue.id].description,
            resolution: description,
            needsReboot,
            systemsCount: formOptions.getState().values[SYSTEMS]?.length || 0
        };
    });

    useEffect(() => {
        input.onChange(
            input.value !== ''
                ? input.value
                : (existingPlaybookSelected && selectedPlaybook.auto_reboot || records.some(record =>record.needsReboot))
        );
    }, []);

    const rows = buildRows(records, sortByState, false);

    return (
        <Stack hasGutter data-component-ouia-id="wizard-review">
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
                        { input.value ?
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
                    onClick={ () => input.onChange(!input.value) }
                >
                    Turn {input.value ? 'off' : 'on'} autoreboot
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
                onSort={ (event, index, direction) => setSortByState({ index, direction }) }
                sortBy={ sortByState }
            >
                <TableHeader noWrap />
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
    }).isRequired
};

export default Review;
