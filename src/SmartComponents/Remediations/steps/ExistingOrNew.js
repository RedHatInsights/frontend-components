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
import { Skeleton, SkeletonSize } from '../../../PresentationalComponents/Skeleton';

import './ExistingOrNew.scss';

function ExistingOrNewStep(props) {

    const { name, isNewSwitch, existingRemediations, selectedRemediationId } = props.state;

    return (
        <React.Fragment>
            <Form className="ins-c-existing-or-new">
                <Stack gutter='md'>
                    <StackItem>
                        <h1 className='ins-m-text__bold'>Do you want to modify an existing Playbook or create a new one?</h1>
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
                                    defaultChecked={ !props.state.isNewSwitch }
                                    onChange={ () => props.onIsNewSwitch(false) }
                                />
                            </GridItem>
                            <GridItem sm={ 12 } md={ 6 } lg={ 4 }>
                                {
                                    existingRemediations === false ?
                                        <Skeleton size={ SkeletonSize.lg } /> :
                                        <FormSelect
                                            isDisabled={ isNewSwitch }
                                            onChange={ props.onRemediationSelected }
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
                                    defaultChecked={ props.state.isNewSwitch }
                                    onChange={ () => props.onIsNewSwitch(true) }
                                />
                            </GridItem>
                            <GridItem sm={ 12 } md={ 6 } lg={ 4 }>
                                <FormGroup
                                    fieldId="remediation-name"
                                    helperText="Playbook name"
                                >
                                    <TextInput
                                        type="text"
                                        value={ name }
                                        onChange={ props.onNameChange }
                                        aria-label="Name your Playbook"
                                        autoFocus
                                        isDisabled= { !isNewSwitch }
                                    />
                                </FormGroup>
                            </GridItem>
                        </Grid>
                    </StackItem>
                </Stack>
            </Form>
        </React.Fragment>
    );
}

ExistingOrNewStep.propTypes = {
    state: propTypes.object.isRequired,
    onNameChange: propTypes.func.isRequired,
    onIsNewSwitch: propTypes.func.isRequired,
    onRemediationSelected: propTypes.func.isRequired
};

export default ExistingOrNewStep;
