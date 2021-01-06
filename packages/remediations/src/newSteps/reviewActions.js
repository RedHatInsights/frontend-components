import React, { useState, Fragment } from 'react';
import propTypes from 'prop-types';
import useFieldApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-field-api';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-form-api';
import './reviewActions.scss';
import {
    Radio,
    Text,
    TextContent,
    Stack,
    StackItem
} from '@patternfly/react-core';
import { Table, TableVariant, TableHeader, TableBody, sortable } from '@patternfly/react-table';
import { CheckCircleIcon } from '@patternfly/react-icons';

const ReviewActions = (props) => {
    const { issues, issuesMultiple } = props;
    const { input } = useFieldApi(props);
    const formOptions = useFormApi();
    const [ sortByState, setSortByState ] = useState({ index: undefined, direction: undefined });

    const buildRows = () => {
        const sortedRecords = issuesMultiple.sort(
            (a, b) => (
                a[Object.keys(a)[sortByState.index]] > b[Object.keys(b)[sortByState.index]] ? 1 :
                    a[Object.keys(a)[sortByState.index]] < b[Object.keys(b)[sortByState.index]] ? -1 : 0
            ) * (sortByState.direction === 'desc' ? -1 : 1));

        return sortedRecords.map(record => ({
            cells: [
                record.action,
                <Fragment key={`${record.id}-description`}>
                    <p>
                        {record.resolution}
                    </p>
                    {record.alternate > 0 &&
                        (
                            <p>{record.alternate} alternate resolution</p>
                        )}
                </Fragment>,
                {
                    title: record.needsReboot ? <CheckCircleIcon color="green"/> : ' ',
                    value: record.needsReboot
                },
                record.systems
            ]
        }));
    };

    const rows = buildRows();

    const onSort = (event, index, direction) => setSortByState({ index, direction });

    const pluralize = (count, str) => count > 1 ? str + 's' : str;

    return (
        <Stack hasGutter>
            <StackItem>
                <TextContent>
                    <Text>
                        You have selected <b>{`${issues.length} ${pluralize(issues.length, 'item')}`}</b> to remediate. <b>
                            {rows.length} of {`${issues.length} ${pluralize(issues.length, 'item')}`}</b> allow for you to chose from multiple resolution steps.
                    </Text>
                </TextContent>
            </StackItem>
            <StackItem>
                <Radio
                    label={
                        `Review and/or change the resolution steps for ${rows.length > 1 ? 'these' : 'this'} ${rows.length} ${pluralize(rows.length, 'action')}.`
                    }
                    aria-label="Review and/or change the resolution steps"
                    id="change"
                    name="radio"
                    defaultChecked={formOptions.getState().values['manual-resolution']}
                    onChange={() => {
                        formOptions.change('manual-resolution', true);
                        input.onChange(true);
                    }}
                />
                <Text className="ins-c-remediations-choose-actions-description">
                    {`The ${issues.length - rows.length} other selected ${pluralize(issues.length - rows.length, 'issue')} 
                    ${issues.length - rows.length > 1 ? 'do' : 'does'} not have multiple resolution options.`}
                </Text>
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
            <StackItem>
                <Radio
                    label={'Accept all recommended resolution steps for all actions'}
                    aria-label="Accept all recommended resolution steps for all actions"
                    id="accept"
                    name="radio"
                    defaultChecked={!formOptions.getState().values['manual-resolution']}
                    onChange={() => {
                        formOptions.change('manual-resolution', false);
                        input.onChange(false);
                    }}
                />
                <Text className="ins-c-remediations-choose-actions-description">
                    You may modify reboot status to manual reboot in the next step, or from the playbook.
                </Text>
            </StackItem>
        </Stack >
    );
};

ReviewActions.propTypes = {
    issues: propTypes.array,
    issuesMultiple: propTypes.array
};

export default ReviewActions;

