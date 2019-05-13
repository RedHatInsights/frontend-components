import React from 'react';
import * as ReactCore from '@patternfly/react-core';

import propTypes from 'prop-types';

function getLoader () {
    return (insights.experimental && insights.experimental.loadRemediations) || insights.loadRemediations;
}

class RemediationButton extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            remediations: false
        };
    }

    componentDidMount() {
        getLoader()({
            react: React,
            reactCore: ReactCore
        }).then(remediations => this.setState({ remediations }));
    }

    onClick = () => {
        Promise.resolve(this.props.dataProvider())
        .then(data => this.state.remediations.openWizard(data))
        .then(result => result && this.props.onRemediationCreated(result));
    }

    render() {
        return (
            <React.Fragment>
                <ReactCore.Button
                    isDisabled={ this.props.isDisabled || this.state.remediations === false }
                    onClick={ this.onClick } >
                    { this.props.children }
                </ReactCore.Button>

                { this.state.remediations.RemediationWizard && <this.state.remediations.RemediationWizard /> }
            </React.Fragment>
        );
    }
}

RemediationButton.propTypes = {
    isDisabled: propTypes.bool,
    dataProvider: propTypes.func.isRequired,
    onRemediationCreated: propTypes.func,
    children: propTypes.node
};

RemediationButton.defaultProps = {
    isDisabled: false,
    onRemediationCreated: f => f,
    children: 'Remediate with Ansible'
};

export default RemediationButton;
