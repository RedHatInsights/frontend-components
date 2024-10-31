import React from 'react';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateFooter } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateHeader } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateIcon } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import DisconnectedIcon from '@patternfly/react-icons/dist/dynamic/icons/disconnected-icon';

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
        href="https://access.redhat.com/products/red-hat-insights/"
        target="_blank"
        rel="noopener noreferrer"
        className="pf-v5-u-mt-lg"
      >
        {buttonText}
      </Button>
    </EmptyStateFooter>
  </EmptyState>
);

export default NotConnected;
