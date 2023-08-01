import React from 'react';
import { Button, EmptyState, EmptyStateBody, EmptyStateFooter, EmptyStateHeader, EmptyStateIcon } from '@patternfly/react-core';
import { DisconnectedIcon } from '@patternfly/react-icons';

export interface NotConnectedProps {
  titleText?: React.ReactNode;
  bodyText?: React.ReactNode;
  buttonText?: React.ReactNode;
}

const NotConnected: React.FC<NotConnectedProps> = ({
  titleText = 'This system isn’t connected to Insights yet',
  bodyText = 'To get started, activate the Insights client for this system.',
  buttonText = 'Learn how to activate the Insights client',
}) => (
  <EmptyState>
    <EmptyStateHeader titleText={titleText} icon={<EmptyStateIcon icon={DisconnectedIcon} />} headingLevel="h5" />
    <EmptyStateBody>{bodyText}</EmptyStateBody>
    <EmptyStateFooter>
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
    </EmptyStateFooter>
  </EmptyState>
);

export default NotConnected;
