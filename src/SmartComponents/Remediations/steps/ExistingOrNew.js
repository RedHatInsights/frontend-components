import React, { Component } from 'react';
import { getRemediations } from '../../../api/remediations';

import {
    Form,
    FormGroup,
    Radio,
    Select,
    SelectOption,
    TextInput
} from '@patternfly/react-core';

import './ExistingOrNew.scss';

class NameStep extends Component {

    constructor (props) {
        super(props);
        this.state = {
            isNew: true,
            name: '',
            existing: false,
            selectedRemediation: false
        };
    };

    onTextChange = (name) => {
        this.setState({ name });
    };

    onRadioChange = (isNew) => {
        this.setState({
            isNew,
            selectedRemediation: isNew ? false : this.state.existing[0]
        });
    }

    onRemediationSelected = (id) => {
        this.setState({
            selectedRemediation: this.state.existing.find(existing => existing.id === id)
        });
    };

    componentDidMount () {
        getRemediations()
        .then(({ remediations }) => this.setState({ existing: remediations }));
    }

    render() {

        const { name, isNew, existing, selectedRemediation } = this.state;

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
                            isDisabled={ !existing || !existing.length }
                            onChange={ () => this.onRadioChange(false) }
                        />

                        <Select
                            isDisabled={ isNew }
                            onChange={ this.onRemediationSelected }
                            value={ selectedRemediation.id }
                            aria-label="Select an existing Remediation" >
                            { !existing && <SelectOption key="loading" value="loading" label="Loading…" /> }
                            { existing && !existing.length &&  <SelectOption key="empty" value="empty" label="No exising Remediations" /> }
                            { existing && existing.map(({ id, name }) => <SelectOption key={ id } value={ id } label={ name }/>) }
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
                        className={ isNew ? '' : 'ins-c-existing-or-new--hidden' }
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

export default NameStep;
