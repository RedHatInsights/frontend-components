import React from 'react';
import classNames from 'classnames';
import { EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateProps, Stack, StackItem, Title } from '@patternfly/react-core';
import { HourglassHalfIcon } from '@patternfly/react-icons';
import './maintenance.scss';

export interface MaintenanceProps extends Omit<EmptyStateProps, 'children' | 'title'> {
  utcStartTime?: string;
  utcEndTime?: string;
  startTime?: string;
  endTime?: string;
  timeZone?: string;
  description?: React.ReactNode;
  redirectLink?: string;
  className?: string;
}

const Maintenance: React.FunctionComponent<MaintenanceProps> = ({
  utcStartTime = '10am',
  utcEndTime = '12am',
  startTime = '6am',
  endTime = '8am',
  timeZone = 'EST',
  description,
  redirectLink = 'https://status.redhat.com/incidents',
  className,
  ...props
}) => {
  const emptyStateClassName = classNames(className, 'ins-c-empty-state__maintenance');

  return (
    <EmptyState className={emptyStateClassName} {...props}>
      <EmptyStateIcon icon={HourglassHalfIcon} />
      <Title headingLevel="h4" size="lg">
        Maintenance in progress
      </Title>
      <EmptyStateBody>
        {description ? (
          description
        ) : (
          <Stack>
            <StackItem>We are currently undergoing scheduled maintenance and will be</StackItem>
            <StackItem>
              unavailable from {utcStartTime} to {utcEndTime} UTC ({startTime}-{endTime} {timeZone}).
            </StackItem>
            <StackItem>
              For more information please visit <a href={redirectLink}>status.redhat.com</a>.
            </StackItem>
          </Stack>
        )}
      </EmptyStateBody>
    </EmptyState>
  );
};

export default Maintenance;
