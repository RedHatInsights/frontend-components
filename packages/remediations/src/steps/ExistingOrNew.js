import React, { Component } from 'react';
import propTypes from 'prop-types';
import {
    Form,
    FormGroup,
    Grid, GridItem,
    Radio,
    FormSelect,
    FormSelectOption,
    TextInput,
    Stack, StackItem
} from '@patternfly/react-core';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components/components/Skeleton';
import { pluralazie } from '../utils';
import './ExistingOrNew.scss';

const ExistingOrNewStep = ({
    onIsNewSwitch,
    onRemediationSelected,
    onNameChange,
    name,
    nameValid,
    isNewSwitch,
    existingRemediations,
    selectedRemediationId,
    open: { data }
}) => (<Form className="ins-c-existing-or-new">
    <Stack gutter='md'>
        <StackItem>
            <span>
                    You have selected&nbsp;
                <h1 className='ins-m-text__bold'>
                    {data.systems.length} {pluralazie('system', data.systems.length)}
                </h1>
                    &nbsp;with&nbsp;
                <h1 className='ins-m-text__bold'>
                    {data.issues.length} {pluralazie('issue', data.issues.length)}
                </h1>
                    &nbsp;to add to a remedation plan.
            </span>
        </StackItem>
        <StackItem>
            <h1>Do you want to modify an existing Playbook or create a new one?</h1>
        </StackItem>
        <StackItem>
            <Grid>
                <GridItem sm={ 12 } md={ 6 } lg={ 3 }>
                    <Radio
                        label={ existingRemediations ? `Existing Playbook (${existingRemediations.length})` : 'Existing Playbook' }
                        aria-label="Existing Playbook"
                        id="existing"
                        name="radio"
                        isDisabled={ !existingRemediations || !existingRemediations.length }
                        defaultChecked={ !isNewSwitch }
                        onChange={ () => onIsNewSwitch(false) }
                    />
                </GridItem>
                <GridItem sm={ 12 } md={ 6 } lg={ 4 }>
                    {
                        existingRemediations === false ?
                            <Skeleton size={ SkeletonSize.lg } /> :
                            <FormSelect
                                isDisabled={ isNewSwitch }
                                onChange={ onRemediationSelected }
                                value={ selectedRemediationId }
                                aria-label="Select an existing Playbook" >
                                { existingRemediations.length
                                    ? existingRemediations.map(({ id, name }) =>
                                        <FormSelectOption key={ id } value={ id } label={ name } />)
                                    :   <FormSelectOption key="empty" value="empty" label="No exising Playbooks" />
                                }
                            </FormSelect>
                    }
                </GridItem>
            </Grid>
        </StackItem>
        <StackItem>
            <Grid>
                <GridItem sm={ 12 } md={ 6 } lg={ 3 }>
                    <Radio
                        label="Create new Playbook"
                        aria-label="Create new Playbook"
                        id="new"
                        name="radio"
                        defaultChecked={ isNewSwitch }
                        onChange={ () => onIsNewSwitch(true) }
                    />
                </GridItem>
                <GridItem sm={ 12 } md={ 6 } lg={ 4 }>
                    <FormGroup
                        fieldId="remediation-name"
                        helperText="Playbook name"
                        helperTextInvalid="Playbook name has to contain alphanumeric characters"
                        isValid={ nameValid }
                    >
                        <TextInput
                            type="text"
                            value={ name }
                            onChange={ onNameChange }
                            aria-label="Name your Playbook"
                            autoFocus
                            isDisabled={ !isNewSwitch }
                            isValid={ nameValid }
                        />
                    </FormGroup>
                </GridItem>
            </Grid>
        </StackItem>
    </Stack>
</Form>);

ExistingOrNewStep.propTypes = {
    onNameChange: propTypes.func,
    onIsNewSwitch: propTypes.func,
    onRemediationSelected: propTypes.func,
    name: propTypes.string,
    nameValid: propTypes.bool,
    isNewSwitch: propTypes.bool,
    existingRemediations: propTypes.array,
    selectedRemediationId: propTypes.string,
    open: propTypes.shape({
        data: propTypes.shape({
            systems: propTypes.array,
            issues: propTypes.array
        })
    })
};

ExistingOrNewStep.defaultProps = {
    open: {
        data: {
            systems: [],
            issues: []
        }
    },
    selectedRemediationId: '',
    existingRemediations: [],
    isNewSwitch: false,
    nameValid: false,
    name: '',
    onRemediationSelected: () => undefined,
    onIsNewSwitch: () => undefined,
    onNameChange: () => undefined
};

export default ExistingOrNewStep;
