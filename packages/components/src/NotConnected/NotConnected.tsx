import React from 'react';
import { EmptyState, EmptyStateIcon, EmptyStateBody, Title, Button } from '@patternfly/react-core';
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
    <EmptyStateIcon icon={DisconnectedIcon} />
    <Title headingLevel="h5" size="lg">
      {titleText}
    </Title>
    <EmptyStateBody>{bodyText}</EmptyStateBody>
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

export default NotConnected;
