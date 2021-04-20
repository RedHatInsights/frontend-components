import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import useFieldApi from '@data-driven-forms/react-form-renderer/dist/esm/use-field-api';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/esm/use-form-api';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components/Skeleton';
import * as api from '../api';
import {
    FormGroup,
    Grid, GridItem,
    Radio,
    FormSelect,
    FormSelectOption,
    Text,
    TextContent,
    TextInput,
    Stack, StackItem,
    Popover,
    Button,
    Alert
} from '@patternfly/react-core';
import {
    pluralize,
    EXISTING_PLAYBOOK,
    EXISTING_PLAYBOOK_SELECTED
} from '../utils';
import './selectPlaybook.scss';
import { Fragment } from 'react';

const SelectPlaybook = (props) => {
    const { issues, allSystems, warnings, resolutionsCount } = props;
    const { input } = useFieldApi(props);
    const formOptions = useFormApi();
    const values = formOptions.getState().values;

    const [ existingRemediations, setExistingRemediations ] = useState();
    const [ existingPlaybookSelected, setExistingPlaybookSelected ] = useState(values[EXISTING_PLAYBOOK_SELECTED]);
    const [ newPlaybookName, setNewPlaybookName ] = useState(values[EXISTING_PLAYBOOK_SELECTED] ? '' : input.value);
    const [ selectedPlaybook, setSelectedPlaybook ] = useState(values[EXISTING_PLAYBOOK]);
    const [ isLoadingRemediation, setIsLoadingRemediation ] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const { data: existingRemediations } = await api.getRemediations();
            setExistingRemediations(existingRemediations);
        }

        fetchData();
    }, []);

    return (
        <Stack hasGutter>
            <StackItem>
                {warnings.length !== 0 && (
                    <StackItem>
                        <Alert variant="warning" isInline title={<Text>
                            There {pluralize(warnings.length, 'was', 'were')} <Popover
                                aria-label="Resolution error popover"
                                bodyContent={<Fragment>
                                    {warnings.map((warning, key) => <div key={key}>{warning}</div>)}
                                </Fragment>}
                            >
                                <b><Button variant="link" isInline>{warnings.length}</Button> {pluralize(warnings.length, 'error')}</b>
                            </Popover> while fetching resolutions for your issues! </Text>} />
                    </StackItem>
                )}
                <TextContent>
                    <Text>
                        You selected <b>{`${allSystems.length} ${pluralize(allSystems.length, 'system')}`} </b>
                        to remediate with Ansible, which in total includes <b>{`${issues.length} ${pluralize(issues.length, 'issue')}`} </b>
                        {issues.length !== resolutionsCount ? <Fragment>
                            of which <b>{resolutionsCount} </b>
                        </Fragment> : 'which'} can be remediated by Ansible.
                    </Text>
                </TextContent>
            </StackItem>
            <StackItem>
                <Grid hasGutter>
                    <GridItem sm={12} md={6} lg={4}>
                        <Radio
                            label={existingRemediations ? `Add to existing playbook (${existingRemediations.length})` : 'Add to existing playbook'}
                            aria-label="Add to existing playbook"
                            id="existing"
                            name="radio"
                            isDisabled={!existingRemediations || !existingRemediations.length}
                            defaultChecked={existingPlaybookSelected}
                            onChange={() => {
                                setExistingPlaybookSelected(true);
                                formOptions.change(EXISTING_PLAYBOOK_SELECTED, true);
                                input.onChange(selectedPlaybook?.name || '');
                                formOptions.change(EXISTING_PLAYBOOK, selectedPlaybook);
                            }}
                        />
                    </GridItem>
                    <GridItem sm={12} md={6} lg={4}>
                        {
                            existingRemediations && !isLoadingRemediation ?
                                <FormSelect
                                    onChange={val => {
                                        setIsLoadingRemediation(true);
                                        api.getRemediation(val).then(remediation => {
                                            setSelectedPlaybook(remediation);
                                            setIsLoadingRemediation(false);
                                            existingPlaybookSelected && input.onChange(remediation.name);
                                            existingPlaybookSelected && formOptions.change(EXISTING_PLAYBOOK, remediation);
                                        });
                                    }}
                                    value={selectedPlaybook?.id || ''}
                                    aria-label="Select an existing playbook" >
                                    {existingRemediations?.length
                                        ? [ <FormSelectOption key='select-playbook-placeholder' value='' label='Select playbook' isDisabled />,
                                            ...existingRemediations.map(({ id, name }) =>
                                                <FormSelectOption key={id} value={id} label={name} />)
                                        ]
                                        : <FormSelectOption key="empty" value="empty" label="No existing playbooks" />
                                    }
                                </FormSelect> :
                                <Skeleton size={SkeletonSize.lg} />

                        }
                    </GridItem>
                </Grid>
            </StackItem>
            <StackItem>
                <Grid hasGutter>
                    <GridItem sm={12} md={6} lg={4}>
                        <Radio
                            label="Create new playbook"
                            aria-label="Create new playbook"
                            id="new"
                            name="radio"
                            defaultChecked={!existingPlaybookSelected}
                            onChange={() => {
                                setExistingPlaybookSelected(false);
                                formOptions.change(EXISTING_PLAYBOOK_SELECTED, false);
                                input.onChange(newPlaybookName);
                                formOptions.change(EXISTING_PLAYBOOK, undefined);
                            }}
                        />
                    </GridItem>
                    <GridItem sm={12} md={6} lg={4}>
                        <FormGroup
                            fieldId="remediation-name"
                        >
                            <TextInput
                                type="text"
                                value={newPlaybookName}
                                onChange={(val) => {
                                    setNewPlaybookName(val);
                                    existingPlaybookSelected || input.onChange(val);
                                }}
                                aria-label="Name your playbook"
                                autoFocus
                            />
                        </FormGroup>
                    </GridItem>
                </Grid>
            </StackItem>
        </Stack >
    );
};

SelectPlaybook.propTypes = {
    allSystems: propTypes.arrayOf(propTypes.string).isRequired,
    issues: propTypes.arrayOf(propTypes.shape({
        description: propTypes.string,
        id: propTypes.string
    })).isRequired,
    warnings: propTypes.arrayOf(propTypes.string),
    resolutionsCount: propTypes.number
};

SelectPlaybook.defaultProps = {
    warnings: []
};

export default SelectPlaybook;
