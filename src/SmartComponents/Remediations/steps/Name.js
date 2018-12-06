import React, { Component } from 'react';

import {
    Form,
    FormGroup,
    TextInput
} from '@patternfly/react-core';

class NameStep extends Component {

    constructor (props) {
        super(props);
        this.state = {
            value: ''
        };

        this.onTextChange = this.onTextChange.bind(this);
    };

    onTextChange (value) {
        this.setState({ value });
    };

    render() {

        const { value } = this.state;

        return (
            <React.Fragment>
                <h2>Name your remediation</h2>
                <Form>
                    <FormGroup
                        label="Remediation Name"
                        isRequired
                        fieldId="remediation-name"
                    >
                        <TextInput
                            isRequired
                            type="text"
                            value={ value }
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
