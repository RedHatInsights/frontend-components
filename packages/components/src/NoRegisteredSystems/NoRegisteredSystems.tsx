import React from 'react';
import { Button, EmptyState, EmptyStateBody, EmptyStateFooter, EmptyStateHeader, EmptyStateIcon } from '@patternfly/react-core';
import { DisconnectedIcon } from '@patternfly/react-icons';

export interface NoRegisteredSystemsProps {
  titleText?: React.ReactNode;
  bodyText?: React.ReactNode;
  buttonText?: React.ReactNode;
}

const NoRegisteredSystems: React.FC<NoRegisteredSystemsProps> = ({
  titleText = 'Do more with your Red Hat Enterprise Linux environment',
  bodyText = 'Connect your systems to keep your Red Hat environment running efficiently, with security and compliance with various standards.',
  buttonText = 'Learn more about connecting your systems',
}) => (
  <EmptyState>
    <EmptyStateHeader titleText={titleText} icon={<EmptyStateIcon icon={DisconnectedIcon} />} headingLevel="h5" />
    <EmptyStateBody>{bodyText}</EmptyStateBody>
    <EmptyStateFooter>
      <Button
        variant="primary"
        component="a"
        href="https://access.redhat.com/products/red-hat-insights#getstarted"
        target="_blank"
        rel="noopener noreferrer"
        className="pf-v5-u-mt-lg"
      >
        {buttonText}
      </Button>
    </EmptyStateFooter>
  </EmptyState>
);

export default NoRegisteredSystems;
