import { FormattedMessage, useIntlWithFallback } from '@redhat-cloud-services/frontend-components-translations/localization';
import React from 'react';
import classNames from 'classnames';
import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';

import { EmptyStateProps } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { Stack } from '@patternfly/react-core/dist/dynamic/layouts/Stack';
import { StackItem } from '@patternfly/react-core/dist/dynamic/layouts/Stack';
import HourglassHalfIcon from '@patternfly/react-icons/dist/dynamic/icons/hourglass-half-icon';
import './maintenance.scss';
import messages from '../messages';

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

const Maintenance = ({
  utcStartTime = '10am',
  utcEndTime = '12am',
  startTime = '6am',
  endTime = '8am',
  timeZone = 'EST',
  description,
  redirectLink = 'https://status.redhat.com/incidents',
  className,
  ...props
}: MaintenanceProps) => {
  const intl = useIntlWithFallback();

  const emptyStateClassName = classNames(className, 'ins-c-empty-state__maintenance');

  return (
    <EmptyState
      headingLevel="h4"
      icon={HourglassHalfIcon}
      titleText={intl.formatMessage(messages.maintenanceMaintenanceInProgress)}
      className={emptyStateClassName}
      {...props}
    >
      <EmptyStateBody>
        {description ? (
          description
        ) : (
          <Stack>
            <FormattedMessage
              {...messages.maintenanceSchedule}

              values={{
                utcStartTime,
                utcEndTime,
                startTime,
                endTime,
                timeZone,
                lead: (chunks) => <StackItem>{chunks}</StackItem>,
                schedule: (chunks) => <StackItem>{chunks}</StackItem>,
              }}
            />
            <StackItem>
              <FormattedMessage
                {...messages.maintenanceMoreInformation}

                values={{ status: (chunks) => <a href={redirectLink}>{chunks}</a> }}
              />
            </StackItem>
          </Stack>
        )}
      </EmptyStateBody>
    </EmptyState>
  );
};

export default Maintenance;
