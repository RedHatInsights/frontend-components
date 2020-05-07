import React from 'react';
import propTypes from 'prop-types';
import {
    Title,
    TextContent,
    Button,
    Bullseye,
    EmptyState,
    EmptyStateBody,
    EmptyStateSecondaryActions,
    EmptyStateIcon
} from '@patternfly/react-core';
import { CloudSecurityIcon } from '@patternfly/react-icons';

const ComplianceEmptyState = ({ title, mainButton }) => (
    <Bullseye>
        <EmptyState>
            <EmptyStateIcon style={{ fontWeight: '500', color: 'var(--pf-global--primary-color--100)' }}
                size="xl" title="Compliance" icon={CloudSecurityIcon} />
            <br/>
            <Title size="lg">{ title }</Title>
            <br/>
            <EmptyStateBody>
                <TextContent>
                    The Compliance service uses SCAP policies to track your organization&#39;s adherence to
                    compliance requirements.
                </TextContent>
                <TextContent>
                    Get started by adding a policy, or read documentation about how to connect OpenSCAP to the
                    Compliance service.
                </TextContent>
            </EmptyStateBody>
            { mainButton }
            <EmptyStateSecondaryActions>
                <Button variant='link' component='a' target='_blank' rel='noopener noreferrer'
                    href={ `https://access.redhat.com/documentation/en-us/red_hat_insights/ \
                          2020-04/html/assessing_and_monitoring_security_policy_compliance_of_rhel_systems/index` } >
                    Learn about OpenSCAP and Compliance
                </Button>
            </EmptyStateSecondaryActions>
        </EmptyState>
    </Bullseye>
);

ComplianceEmptyState.propTypes = {
    title: propTypes.string,
    mainButton: propTypes.object
};

ComplianceEmptyState.defaultProps = {
    title: 'No policies',
    mainButton: <Button
        variant="primary"
        component="a"
        href="/insights/compliance/scappolicies">
        Create new policy
    </Button>
};

export default ComplianceEmptyState;
