import React from 'react';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateFooter } from '@patternfly/react-core/dist/dynamic/components/EmptyState';

import DisconnectedIcon from '@patternfly/react-icons/dist/dynamic/icons/disconnected-icon';

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
  <EmptyState headingLevel="h5" icon={DisconnectedIcon} titleText={titleText}>
    <EmptyStateBody>{bodyText}</EmptyStateBody>
    <EmptyStateFooter>
      <Button
        variant="primary"
        component="a"
        href="https://access.redhat.com/products/red-hat-insights#getstarted"
        target="_blank"
        rel="noopener noreferrer"
        className="pf-v6-u-mt-lg"
      >
        {buttonText}
      </Button>
    </EmptyStateFooter>
  </EmptyState>
);

export default NoRegisteredSystems;
