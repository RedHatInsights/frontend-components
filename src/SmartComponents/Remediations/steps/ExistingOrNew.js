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

class ExistingOrNewStep extends Component {

    constructor (props) {
        super(props);
    };

    onTextChange = (name) => {
        this.props.setState({ name });
    };

    onRadioChange = (isNewSwitch) => {
        this.props.setState({
            isNewSwitch,
            selectedRemediation: isNewSwitch ? false : this.props.state.existingRemediations[0]
        });
    }

    onRemediationSelected = (id) => {
        this.props.setState({
            selectedRemediation: this.props.state.existingRemediations.find(existing => existing.id === id)
        });
    };

    render() {

        const { name, isNewSwitch, existingRemediations, selectedRemediation } = this.props.state;

        return (
            <React.Fragment>
                <h1>Do you want to modify an existing Remediation or create a new one?</h1>
                <Form className="ins-c-existing-or-new">
                    <div className="ins-c-existing-or-new__existing">
                        <Radio
                            label="Existing Remediation"
                            aria-label="Existing Remediation"
                            id="existing"
                            name="radio"
                            isDisabled={ !existingRemediations || !existingRemediations.length }
                            onChange={ () => this.onRadioChange(false) }
                        />

                        <Select
                            isDisabled={ isNewSwitch }
                            onChange={ this.onRemediationSelected }
                            value={ selectedRemediation.id }
                            aria-label="Select an existing Remediation" >
                            {
                                !existingRemediations &&
                                <SelectOption key="loading" value="loading" label="Loading…" />
                            }
                            {
                                existingRemediations && !existingRemediations.length &&
                                <SelectOption key="empty" value="empty" label="No exising Remediations" />
                            }
                            {
                                existingRemediations && existingRemediations.map(({ id, name }) =>
                                    <SelectOption key={ id } value={ id } label={ name }/>)
                            }
                        </Select>
                    </div>

                    <Radio
                        label="New Remediation"
                        aria-label="New Remediation"
                        id="new"
                        name="radio"
                        defaultChecked
                        onChange={ () => this.onRadioChange(true) }
                    />

                    <FormGroup
                        label="Remediation Name"
                        isRequired
                        fieldId="remediation-name"
                        className={ isNewSwitch ? '' : 'ins-c-existing-or-new--hidden' }
                    >
                        <TextInput
                            isRequired
                            type="text"
                            value={ name }
                            onChange={ this.onTextChange }
                            placeholder="Unnamed remediation"
                            aria-label="Name your remediation"
                            autoFocus
                        />
                    </FormGroup>
                </Form>
            </React.Fragment>
        );
    }
};

ExistingOrNewStep.propTypes = {
    state: propTypes.object.isRequired,
    setState: propTypes.func.isRequired
};

export default ExistingOrNewStep;
