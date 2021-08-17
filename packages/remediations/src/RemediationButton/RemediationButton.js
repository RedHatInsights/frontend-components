import React from 'react';

import propTypes from 'prop-types';

import { CAN_REMEDIATE } from '../utils';
import { Button, Tooltip } from '@patternfly/react-core';

function getLoader () {
    return (insights.experimental && insights.experimental.loadRemediations) || insights.loadRemediations;
}

class RemediationButton extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            remediations: false,
            hasPermission: false
        };
    }

    componentDidMount() {
        Promise.all([
            // Remediations does not require external deps anymore
            getLoader()({}),
            insights.chrome.getUserPermissions('remediations')
        ]).then(([
            remediations,
            permissions
        ]) => {
            this.setState({
                remediations,
                hasPermission: permissions.some(({ permission }) => permission === CAN_REMEDIATE)
            });
        });
    }

    onClick = () => {
        Promise.resolve(this.props.dataProvider())
        .then(data => this.state.remediations.openWizard({ ...data, onRemediationCreated: this.props.onRemediationCreated }));
    }

    render() {
        const { children, buttonProps } = this.props;

        if (this.state.remediations && !this.state.hasPermission) {
            return (
                <Tooltip
                    content="You do not have correct permissions to remediate this entity."
                >
                    <span>
                        <Button isDisabled { ...buttonProps }>
                            { children }
                        </Button>
                    </span>
                </Tooltip>
            );
        }

        return (
            <React.Fragment>
                <Button
                    isDisabled={ this.props.isDisabled || this.state.remediations === false }
                    onClick={ this.onClick }
                    { ...buttonProps }
                >
                    { children }
                </Button>

                { this.state.remediations.RemediationWizard && <this.state.remediations.RemediationWizard /> }
            </React.Fragment>
        );
    }
}

RemediationButton.propTypes = {
    isDisabled: propTypes.bool,
    dataProvider: propTypes.func.isRequired,
    onRemediationCreated: propTypes.func,
    children: propTypes.node,
    buttonProps: propTypes.object
};

RemediationButton.defaultProps = {
    isDisabled: false,
    onRemediationCreated: f => f,
    children: 'Remediate with Ansible'
};

export default RemediationButton;
