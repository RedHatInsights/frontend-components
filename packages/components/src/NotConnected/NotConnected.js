import React from 'react';
import propTypes from 'prop-types';
import { EmptyState, EmptyStateIcon, EmptyStateBody, Title, Button } from '@patternfly/react-core';
import { DisconnectedIcon } from '@patternfly/react-icons';

const NotConnected = ({ titleText, bodyText, buttonText }) => (
    <EmptyState>
        <EmptyStateIcon icon={DisconnectedIcon} />
        <Title headingLevel="h5" size="lg">
            {titleText}
        </Title>
        <EmptyStateBody>
            {bodyText}
        </EmptyStateBody>
        <Button
            variant="primary"
            component="a"
            href="http://access.redhat.com/products/cloud_management_services_for_rhel#getstarted"
            target="_blank"
            rel="noopener noreferrer"
            className="pf-u-mt-lg"
        >
            {buttonText}
        </Button>
    </EmptyState>
);

NotConnected.propTypes = {
    titleText: propTypes.node,
    bodyText: propTypes.node,
    buttonText: propTypes.node
};

NotConnected.defaultProps = {
    titleText: 'This system is not yet connected to Insights',
    bodyText: 'Activate the Insights client for this system to get started.',
    buttonText: 'Learn about the Insights client'
};

export default NotConnected;
