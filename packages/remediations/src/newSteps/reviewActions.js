import React, { useState, Fragment } from 'react';
import propTypes from 'prop-types';
import useFieldApi from '@data-driven-forms/react-form-renderer/dist/esm/use-field-api';
import {
    Radio,
    Text,
    TextContent,
    Stack,
    StackItem
} from '@patternfly/react-core';
import { Table, TableVariant, TableHeader, TableBody, sortable } from '@patternfly/react-table';
import { CloseIcon, RedoIcon } from '@patternfly/react-icons';
import './reviewActions.scss';

const ReviewActions = (props) => {
    const { issues, issuesMultiple } = props;
    const { input } = useFieldApi(props);
    const [ sortByState, setSortByState ] = useState({ index: undefined, direction: undefined });

    const sortedRecords = issuesMultiple.sort(
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
                    id="change"
                    name="radio"
                    isChecked={input.value}
                    onChange={() => input.onChange(true)}
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
                    id="accept"
                    name="radio"
                    isChecked={!input.value}
                    onChange={() => input.onChange(false)}
                />
                <Text className="ins-c-remediations-choose-actions-description">
                    You may modify reboot status to manual reboot in the next step, or from the playbook.
                </Text>
            </StackItem>
        </Stack >
    );
};

ReviewActions.propTypes = {
    issues: propTypes.arrayOf(propTypes.shape({
        description: propTypes.string,
        id: propTypes.string
    })).isRequired,
    issuesMultiple: propTypes.arrayOf(propTypes.shape({
        id: propTypes.string,
        shortId: propTypes.string,
        action: propTypes.string,
        alternate: propTypes.number,
        needsReboot: propTypes.bool,
        resolution: propTypes.string,
        systemsCount: propTypes.number
    })).isRequired
};

export default ReviewActions;
