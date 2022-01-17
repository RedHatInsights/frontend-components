import React from 'react';
import PropTypes from 'prop-types';

import { Title, Button, EmptyState, EmptyStateVariant, EmptyStateIcon, EmptyStateBody } from '@patternfly/react-core';

import { LockIcon } from '@patternfly/react-icons';

import './NotAuthorized.scss';

const ContactBody = () => (
  <React.Fragment>
    Contact your organization administrator(s) for more information or visit&nbsp;
    <a href={`./settings/my-user-access`}>My User Access</a>&nbsp; to learn more about your permissions.
  </React.Fragment>
);

const NotAuthorized = ({
  prevPageButtonText,
  toLandingPageText,
  title,
  actions,
  serviceName,
  icon: Icon,
  description,
  showReturnButton,
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

const serviceNamePropType = (props, propName, componentName, ...args) => {
  if (typeof props.title === 'undefined') {
    return PropTypes.node.isRequired(props, propName, componentName, ...args);
  }
};

NotAuthorized.propTypes = {
  serviceName: serviceNamePropType,
  icon: PropTypes.func,
  description: PropTypes.node,
  showReturnButton: PropTypes.bool,
  className: PropTypes.string,
  title: PropTypes.node,
  actions: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  prevPageButtonText: PropTypes.node,
  toLandingPageText: PropTypes.node,
};

NotAuthorized.defaultProps = {
  icon: LockIcon,
  showReturnButton: true,
  description: <ContactBody />,
  actions: null,
  prevPageButtonText: 'Return to previous page',
  toLandingPageText: 'Go to landing page',
};

export default NotAuthorized;
