import React from 'react';
import propTypes from 'prop-types';

import {
    Form,
    FormGroup,
    Grid, GridItem,
    Radio,
    FormSelect,
    FormSelectOption,
    TextInput,
    Stack, StackItem, Title
} from '@patternfly/react-core';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components/Skeleton';

import './ExistingOrNew.scss';

function ExistingOrNewStep(props) {

    const { name, nameValid, isNewSwitch, existingRemediations, selectedRemediationId } = props.state;

    existingRemediations &&
        existingRemediations.sort((a, b) => (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : -1);

    return (
        <React.Fragment>
            <Form className="ins-c-existing-or-new">
                <Stack hasGutter>
                    <StackItem>
                        <Title headingLevel="h2">
                            Do you want to modify an existing playbook or create a new one?
                        </Title>
                    </StackItem>
                    <StackItem>
                        <Grid hasGutter>
                            <GridItem sm={ 12 } md={ 6 } lg={ 3 }>
                                <Radio
                                    label={ existingRemediations ? `Existing playbook (${existingRemediations.length})` : 'Existing playbook' }
                                    aria-label="Existing playbook"
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
                                            aria-label="Select an existing playbook" >
                                            { existingRemediations.length
                                                ? existingRemediations.map(({ id, name }) =>
                                                    <FormSelectOption key={ id } value={ id } label={ name } />)
                                                :   <FormSelectOption key="empty" value="empty" label="No existing playbooks" />
                                            }
                                        </FormSelect>
                                }
                            </GridItem>
                        </Grid>
                    </StackItem>
                    <StackItem>
                        <Grid hasGutter>
                            <GridItem sm={ 12 } md={ 6 } lg={ 3 }>
                                <Radio
                                    label="Create new playbook"
                                    aria-label="Create new playbook"
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
                                    helperTextInvalid="Playbook name has to contain alphanumeric characters"
                                    validated={nameValid ? 'default' : 'error' }
                                >
                                    <TextInput
                                        type="text"
                                        value={ name }
                                        onChange={ props.onNameChange }
                                        aria-label="Name your playbook"
                                        autoFocus
                                        isDisabled={ !isNewSwitch }
                                        validated={nameValid ? 'default' : 'error'}
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
