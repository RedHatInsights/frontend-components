import React, { Component } from 'react';
import BaseRemediationWizard from './RemediationWizard';

class RemediationWizard extends Component {

    state = {
        isOpen: false
    }

    openWizard = (data, basePath) => {
        this.setState({
            isOpen: true,
            data: {
                ...data,
                systems: data.systems || []
            },
            basePath
        });
    }

    setOpen = (value) => {
        this.setState({ isOpen: value });
    }

    render () {
        return (
            this.state.isOpen
                ? <BaseRemediationWizard
                    data={this.state.data}
                    basePath={this.state.basePath}
                    setOpen={this.setOpen}/>
                : null
        );
    }
}

export default RemediationWizard;
