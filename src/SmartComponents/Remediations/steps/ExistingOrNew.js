import React, { Component } from 'react';
import propTypes from 'prop-types';

import {
    Form,
    FormGroup,
    Radio,
    Select,
    SelectOption,
    TextInput
} from '@patternfly/react-core';

import './ExistingOrNew.scss';

function ExistingOrNewStep(props) {

    const { name, isNewSwitch, existingRemediations, selectedRemediationId } = props.state;

    return (
        <React.Fragment>
            <h1 className='ins-m-text__bold'>Do you want to modify an existing Playbook or create a new one?</h1>
            <Form className="ins-c-existing-or-new">
                <div className="ins-c-existing-or-new__existing">
                    <Radio
                        label="Existing Playbook"
                        aria-label="Existing Playbook"
                        id="existing"
                        name="radio"
                        isDisabled={ !existingRemediations || !existingRemediations.length }
                        defaultChecked={ !props.state.isNewSwitch }
                        onChange={ () => props.onIsNewSwitch(false) }
                    />

                    <Select
                        isDisabled={ isNewSwitch }
                        onChange={ props.onRemediationSelected }
                        value={ selectedRemediationId }
                        aria-label="Select an existing Playbook" >
                        {
                            !existingRemediations &&
                            <SelectOption key="loading" value="loading" label="Loading…" />
                        }
                        {
                            existingRemediations && !existingRemediations.length &&
                            <SelectOption key="empty" value="empty" label="No exising Playbooks" />
                        }
                        {
                            existingRemediations && existingRemediations.map(({ id, name }) =>
                                <SelectOption key={ id } value={ id } label={ name } />)
                        }
                    </Select>
                </div>

                <Radio
                    label="New Playbook"
                    aria-label="New Playbook"
                    id="new"
                    name="radio"
                    defaultChecked={ props.state.isNewSwitch }
                    onChange={ () => props.onIsNewSwitch(true) }
                />

                <FormGroup
                    label="Playbook Name"
                    isRequired
                    fieldId="remediation-name"
                    className={ isNewSwitch ? '' : 'ins-c-existing-or-new--hidden' }
                >
                    <TextInput
                        isRequired
                        type="text"
                        value={ name }
                        onChange={ props.onNameChange }
                        placeholder="Unnamed Playbook"
                        aria-label="Name your Playbook"
                        autoFocus
                    />
                </FormGroup>
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
