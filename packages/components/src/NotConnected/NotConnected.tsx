import { useIntlWithFallback } from '@redhat-cloud-services/frontend-components-translations/localization';
import React from 'react';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateFooter } from '@patternfly/react-core/dist/dynamic/components/EmptyState';

import DisconnectedIcon from '@patternfly/react-icons/dist/dynamic/icons/disconnected-icon';
import messages from '../messages';

export interface NotConnectedProps {
  titleText?: React.ReactNode;
  bodyText?: React.ReactNode;
  buttonText?: React.ReactNode;
}

const NotConnected = ({ titleText: titleTextProp, bodyText: bodyTextProp, buttonText: buttonTextProp }: NotConnectedProps) => {
  const intl = useIntlWithFallback();
  const titleText = titleTextProp === undefined ? intl.formatMessage(messages.notConnectedTitleText) : titleTextProp;
  const bodyText = bodyTextProp === undefined ? intl.formatMessage(messages.notConnectedBodyText) : bodyTextProp;
  const buttonText = buttonTextProp === undefined ? intl.formatMessage(messages.notConnectedButtonText) : buttonTextProp;
  return (
    <EmptyState headingLevel="h5" icon={DisconnectedIcon} titleText={titleText}>
      <EmptyStateBody>{bodyText}</EmptyStateBody>
      <EmptyStateFooter>
        <Button
          variant="primary"
          component="a"
          href="https://access.redhat.com/products/red-hat-insights/"
          target="_blank"
          rel="noopener noreferrer"
          className="pf-v6-u-mt-lg"
        >
          {buttonText}
        </Button>
      </EmptyStateFooter>
    </EmptyState>
  );
};

export default NotConnected;
