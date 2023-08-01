import React from 'react';
import { EmptyState, EmptyStateBody, EmptyStateHeader, EmptyStateIcon, EmptyStateVariant } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import './Unavailable.scss';

const Unavailable: React.FC = () => {
  return (
    <EmptyState variant={EmptyStateVariant.lg} className="ins-c-empty-state__unavailable pf-m-redhat-font">
      <EmptyStateHeader titleText="This page is temporarily unavailable" icon={<EmptyStateIcon icon={ExclamationCircleIcon} />} headingLevel="h5" />
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
