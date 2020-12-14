import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import useFieldApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-field-api';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-form-api';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components/components/cjs/Skeleton';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@patternfly/react-icons';
// import { sortable } from '@patternfly/react-table';
import * as api from '../api';
import './selectPlaybook.scss';
import {
    ExpandableSection,
    FormGroup,
    Grid, GridItem,
    Radio,
    FormSelect,
    FormSelectOption,
    Text,
    TextContent,
    TextInput,
    Stack, StackItem
} from '@patternfly/react-core';

const SelectPlaybook = (props) => {
    const { SelectPlaybookProps: { issues, systems } } = props;
    const { input } = useFieldApi(props);
    const formOptions = useFormApi();
    const [ existingRemediations, setExistingRemediations ] = useState(false);
    const [ existingPlaybookSelected, setExistingPlaybookSelected ] = useState(false);
    const [ newPlaybookName, setNewPlaybookName ] = useState('');
    const [ selectedPlaybook, setSelectedPlaybook ] = useState('');
    const [ expandedIssues, setExpandedIssues ] = useState(false);
    const nameValid = true;

    useEffect(() => {
        async function fetchData() {
            const { data: existingRemediations } = await api.getRemediations();
            setExistingRemediations(existingRemediations);
        }

        fetchData();
    }, []);

    const pluralize = (count, str) => count > 1 ? str + 's' : str;

    return (
        <Stack hasGutter>
            <StackItem>
                <TextContent>
                    <Text>
                        You selected <b>{`${systems.length} ${pluralize(systems.length, 'system')}`} </b>
                        to remediate with Ansible, which in total includes  <b>{`${issues.length} ${pluralize(issues.length, 'issue')}.`} </b>
                    </Text>
                    <Text className='ins-c-remediations-can-be-remediated pf-u-mb-0'>
                        { /* TODO: need real data here!!! */}
                        <CheckCircleIcon/> 99 Issues can be remediated with Ansible
                    </Text>
                    <Text className="ins-c-remediations-select-playbook-description">
                        Issues can be added to an Ansible Playbook
                    </Text>
                    <Text className='ins-c-remediations-cannot-be-remediated pf-u-mb-0'>
                        { /* TODO: need real data here!!! */}
                        <ExclamationTriangleIcon /> 42 Issues cannot be remediated with Ansible
                    </Text>
                    <Text className="pf-u-ml-md">
                        These issues <b>cannot</b> be added to a playbook. Review the remediation steps on the issue to find out how to fix
                    </Text>
                </TextContent>
                <ExpandableSection
                    className="'pf-u-ml-md"
                    toggleText={expandedIssues ? 'Show Less' : 'Show More'}
                    onToggle={(isExpanded) => setExpandedIssues(isExpanded)}
                    isExpanded={expandedIssues}
                >
                    <ul className="ins-c-remediations-select-playbook-expandable-content">
                        { issues.map(issue => (<li key={issue.id}>{issue.id}</li>))}
                    </ul>
                </ExpandableSection>
            </StackItem>
            <StackItem>
                <Grid hasGutter>
                    <GridItem sm={12} md={6} lg={3}>
                        <Radio
                            label={existingRemediations ? `Existing playbook (${existingRemediations.length})` : 'Existing playbook'}
                            aria-label="Existing playbook"
                            id="existing"
                            name="radio"
                            isDisabled={!existingRemediations || !existingRemediations.length}
                            defaultChecked={existingPlaybookSelected}
                            onChange={() => {
                                setExistingPlaybookSelected(true);
                                formOptions.change('existing-playbook-selected', true);
                                input.onChange(selectedPlaybook);
                                formOptions.change('playbook-name', selectedPlaybook);
                            }}
                        />
                    </GridItem>
                    <GridItem sm={12} md={6} lg={4}>
                        {
                            existingRemediations === false ?
                                <Skeleton size={SkeletonSize.lg} /> :
                                <FormSelect
                                    onChange={val => {
                                        setSelectedPlaybook(val);
                                        input.onChange(val);
                                        formOptions.change('selected-playbook', val);
                                    }}
                                    value={selectedPlaybook}
                                    aria-label="Select an existing playbook" >
                                    {existingRemediations.length
                                        ? [ <FormSelectOption key='select-playbook-placeholder' value='' label='Select playbook' isDisabled />,
                                            ...existingRemediations.map(({ id, name }) =>
                                                <FormSelectOption key={id} value={id} label={name} />)
                                        ]
                                        : <FormSelectOption key="empty" value="empty" label="No existing playbooks" />
                                    }
                                </FormSelect>
                        }
                    </GridItem>
                </Grid>
            </StackItem>
            <StackItem>
                <Grid hasGutter>
                    <GridItem sm={12} md={6} lg={3}>
                        <Radio
                            label="Create new playbook"
                            aria-label="Create new playbook"
                            id="new"
                            name="radio"
                            defaultChecked={!existingPlaybookSelected}
                            onChange={() => {
                                setExistingPlaybookSelected(false);
                                formOptions.change('existing-playbook-selected', false);
                                input.onChange(newPlaybookName);
                                formOptions.change('playbook-name', newPlaybookName);
                            }}
                        />
                    </GridItem>
                    <GridItem sm={12} md={6} lg={4}>
                        <FormGroup
                            fieldId="remediation-name"
                            validated={nameValid ? 'default' : 'error'}
                        >
                            <TextInput
                                type="text"
                                value={newPlaybookName}
                                onChange={(val) => {
                                    console.log('ONCHANGE', val);
                                    setNewPlaybookName(val);
                                    input.onChange(val);
                                    formOptions.change('playbook-name', val);
                                }}
                                aria-label="Name your playbook"
                                autoFocus
                                validated={nameValid ? 'default' : 'error'}
                            />
                        </FormGroup>
                    </GridItem>
                </Grid>
            </StackItem>
        </Stack >
    );
};

SelectPlaybook.propTypes = {
    SelectPlaybookProps: propTypes.objectOf({
        issues: propTypes.arrayOf(propTypes.string),
        systems: propTypes.arrayOf(propTypes.object)
    }),
    props: propTypes.object
};

export default SelectPlaybook;

