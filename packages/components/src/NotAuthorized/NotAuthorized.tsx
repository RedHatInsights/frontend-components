import React from 'react';

import { Button, EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateProps, EmptyStateVariant, Title } from '@patternfly/react-core';

import { LockIcon } from '@patternfly/react-icons';

import './NotAuthorized.scss';

export interface NotAuthorizedProps extends Omit<EmptyStateProps, 'children' | 'title'> {
  serviceName?: string;
  icon?: React.ComponentType<any>;
  description?: React.ReactNode;
  showReturnButton?: boolean;
  className?: string;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  prevPageButtonText?: React.ReactNode;
  toLandingPageText?: React.ReactNode;
}

const ContactBody = () => (
  <React.Fragment>
    Contact your organization administrator(s) for more information or visit&nbsp;
    <a href={`./settings/my-user-access`}>My User Access</a>&nbsp; to learn more about your permissions.
  </React.Fragment>
);

const NotAuthorized: React.FunctionComponent<NotAuthorizedProps> = ({
  prevPageButtonText = 'Return to previous page',
  toLandingPageText = 'Go to landing page',
  title,
  actions = null,
  serviceName,
  icon: Icon = LockIcon,
  description = <ContactBody />,
  showReturnButton = true,
  className,
  ...props
}) => {
  const heading = title || `You do not have access to ${serviceName}`;
  return (
    <EmptyState variant={EmptyStateVariant.full} className={`ins-c-not-authorized ${className || ''}`} {...props}>
      <EmptyStateIcon icon={Icon} />
      <Title headingLevel="h5" size="lg">
        {heading}
      </Title>
      <EmptyStateBody>{description}</EmptyStateBody>
      {actions}
      {showReturnButton &&
        (document.referrer ? (
          <Button variant="primary" onClick={() => history.back()}>
            {prevPageButtonText}
          </Button>
        ) : (
          <Button variant="primary" component="a" href=".">
            {toLandingPageText}
          </Button>
        ))}
    </EmptyState>
  );
};

export default NotAuthorized;
