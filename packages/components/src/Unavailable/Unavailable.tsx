import React from 'react';
import { EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant, Title } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import './Unavailable.scss';

const Unavailable: React.FC = () => {
  return (
    <EmptyState variant={EmptyStateVariant.large} className="ins-c-empty-state__unavailable pf-m-redhat-font">
      <EmptyStateIcon icon={ExclamationCircleIcon} />
      <Title headingLevel="h5" size="lg">
        This page is temporarily unavailable
      </Title>
      <EmptyStateBody>
        Try refreshing the page. If the problem persists, contact your organization administrator or visit our
        <a href="https://status.redhat.com/" target="_blank" rel="noopener noreferrer">
          {' '}
          status page
        </a>{' '}
        for known outages.
      </EmptyStateBody>
    </EmptyState>
  );
};

export default Unavailable;
