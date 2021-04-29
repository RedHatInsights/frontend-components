import React, { useState } from 'react';
import propTypes from 'prop-types';
import useFieldApi from '@data-driven-forms/react-form-renderer/dist/esm/use-field-api';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/esm/use-form-api';
import { Table, TableVariant, TableHeader, TableBody, sortable } from '@patternfly/react-table';
import {
    Radio,
    Text,
    TextContent,
    Stack,
    StackItem
} from '@patternfly/react-core';
import {
    buildRows,
    pluralize,
    EXISTING_PLAYBOOK,
    EXISTING_PLAYBOOK_SELECTED,
    ISSUES_MULTIPLE
} from '../utils';
import './reviewActions.scss';

const ReviewActions = (props) => {
    const { issues } = props;
    const { input } = useFieldApi(props);
    const formOptions = useFormApi();
    const [ sortByState, setSortByState ] = useState({ index: undefined, direction: undefined });

    const values = formOptions.getState().values;
    const records = values[EXISTING_PLAYBOOK_SELECTED]
        ? values[ISSUES_MULTIPLE].filter(issue => !values[EXISTING_PLAYBOOK].issues.some(i => i.id === issue.id))
        : values[ISSUES_MULTIPLE];

    const rows = buildRows(records, sortByState, true);

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
                {issues.length - rows.length > 0 && <Text className="ins-c-remediations-choose-actions-description">
                    {`The ${issues.length - rows.length} other selected ${pluralize(issues.length - rows.length, 'issue')} 
                    ${issues.length - rows.length > 1 ? 'do' : 'does'} not have multiple resolution options.`}
                </Text>}
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
    })).isRequired
};

export default ReviewActions;
