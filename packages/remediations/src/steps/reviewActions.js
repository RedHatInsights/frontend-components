import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import propTypes from 'prop-types';
import useFieldApi from '@data-driven-forms/react-form-renderer/dist/esm/use-field-api';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/esm/use-form-api';
import { Table, TableVariant, TableHeader, TableBody, sortable, expandable } from '@patternfly/react-table';
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
    sortRecords,
    EXISTING_PLAYBOOK,
    EXISTING_PLAYBOOK_SELECTED,
    ISSUES_MULTIPLE,
    onCollapse,
    SYSTEMS
} from '../utils';
import './reviewActions.scss';

const ReviewActions = (props) => {
    const formOptions = useFormApi();
    const values = formOptions.getState().values;
    const issues = props.issues.filter(issue => Object.keys(values[SYSTEMS]).includes(issue.id));
    const { input } = useFieldApi(props);
    const [ sortByState, setSortByState ] = useState({ index: undefined, direction: undefined });
    const allSystemsNamed = useSelector(({ hostReducer: { hosts } }) => hosts?.map(host => (
        { id: host.id, name: host.display_name })) || []
    );

    const multiples = (values[EXISTING_PLAYBOOK_SELECTED]
        ? values[ISSUES_MULTIPLE].filter(issue => !values[EXISTING_PLAYBOOK].issues.some(i => i.id === issue.id))
        : values[ISSUES_MULTIPLE]).map(issue => ({
        ...issue,
        systems: (values[SYSTEMS][issue.id] || []).map(id => allSystemsNamed.find(system => system.id === id)?.name)
    })).filter(record => record.systems.length > 0);

    const [ rows, setRows ] = useState(buildRows(multiples, sortByState, true));

    useEffect(() => {
        setRows(buildRows(multiples, sortByState, true));
    }, [ sortByState ]);

    return (
        <Stack hasGutter data-component-ouia-id="wizard-review-actions">
            <StackItem>
                <TextContent>
                    <Text>
                        You have selected <b>{`${issues.length} ${pluralize(issues.length, 'item')}`}</b> to remediate. <b>
                            {multiples.length} of {`${issues.length} ${pluralize(issues.length, 'item')}`}</b>
                        {multiples.length !== 1 ? ' allow' : ' allows'} for you to chose from multiple resolution steps.
                    </Text>
                </TextContent>
            </StackItem>
            <StackItem>
                <Radio
                    label={
                        `Review and/or change the resolution steps for ${multiples.length !== 1 ? 'these' : 'this'}
                         ${multiples.length} ${pluralize(multiples.length, 'action')}.`
                    }
                    id="change"
                    name="radio"
                    isChecked={input.value}
                    onChange={() => input.onChange(true)}
                />
                {issues.length - multiples.length > 0 && <Text className="ins-c-remediations-choose-actions-description">
                    {`The ${issues.length - multiples.length} other selected ${pluralize(issues.length - multiples.length, 'issue')} 
                    ${issues.length - multiples.length !== 1 ? 'do' : 'does'} not have multiple resolution options.`}
                </Text>}
            </StackItem>
            <Table
                aria-label='Actions'
                className='ins-c-remediation-summary-table'
                variant={ TableVariant.compact }
                onCollapse={(event, rowKey, isOpen) => onCollapse(event, rowKey, isOpen, rows, setRows)}
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
                        transforms: [ sortable ],
                        cellFormatters: [ expandable ]
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
