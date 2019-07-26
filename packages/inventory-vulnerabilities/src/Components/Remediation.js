/* eslint-disable camelcase */

import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import RemediationButton from '@redhat-cloud-services/frontend-components-remediations/RemediationButton';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/RouterParams';
import propTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

class Remediation extends Component {
    remediationProvider = selectedCves => {
        if (!selectedCves || selectedCves.size === 0) {
            return false;
        }

        return {
            issues: [ ...selectedCves ].map(cve => ({ id: `vulnerabilities:${cve}`, description: cve })),
            systems: [ this.props.systemId ]
        };
    };

    shouldComponentUpdate(nextProps) {
        if (nextProps.selectedCves !== this.props.selectedCves) {
            return true;
        }

        return false;
    }

    render() {
        const { selectedCves, addNotification: dispatchNotification } = this.props;
        return (
            <div>
                <RemediationButton
                    dataProvider={ () => this.remediationProvider(selectedCves) }
                    isDisabled={ this.remediationProvider(selectedCves) === false }
                    onRemediationCreated={ result => dispatchNotification(result.getNotification()) }
                >
                    <span className={ 'remediation-btn-lg' }>Remediate with Ansible</span>
                    <span className={ 'remediation-btn-sml' }>Remediate</span>
                </RemediationButton>
            </div>
        );
    }
}

Remediation.propTypes = {
    systemId: propTypes.string,
    selectedCves: propTypes.object,
    addNotification: propTypes.func
};

export default connect(
    null,
    dispatch => ({
        addNotification: notification => dispatch(addNotification(notification))
    })
)(routerParams(Remediation));
