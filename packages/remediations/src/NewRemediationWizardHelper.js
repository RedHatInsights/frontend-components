import React, { Component, Fragment } from 'react';
import RemediationWizard from './NewRemediationWizard';

class NewRemediationWizard extends Component {

    state = {
        isOpen: false
    }

    openWizard = (data, basePath) => {
        this.setState({
            isOpen: true,
            data,
            basePath
        });
    }

    render () {
        return (
            this.state.isOpen ? <RemediationWizard {...this.state}/> : <Fragment/>
        );
    }
}

export default NewRemediationWizard;
