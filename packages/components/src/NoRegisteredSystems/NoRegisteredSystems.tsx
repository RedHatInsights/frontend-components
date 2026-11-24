import { useIntlWithFallback } from '@redhat-cloud-services/frontend-components-translations/localization';
import React from 'react';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { EmptyState } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { EmptyStateFooter } from '@patternfly/react-core/dist/dynamic/components/EmptyState';

import DisconnectedIcon from '@patternfly/react-icons/dist/dynamic/icons/disconnected-icon';
import messages from '../messages';

export interface NoRegisteredSystemsProps {
  titleText?: React.ReactNode;
  bodyText?: React.ReactNode;
  buttonText?: React.ReactNode;
}

const NoRegisteredSystems = ({ titleText: titleTextProp, bodyText: bodyTextProp, buttonText: buttonTextProp }: NoRegisteredSystemsProps) => {
  const intl = useIntlWithFallback();
  const titleText = titleTextProp === undefined ? intl.formatMessage(messages.noRegisteredSystemsTitleText) : titleTextProp;
  const bodyText = bodyTextProp === undefined ? intl.formatMessage(messages.noRegisteredSystemsBodyText) : bodyTextProp;
  const buttonText = buttonTextProp === undefined ? intl.formatMessage(messages.noRegisteredSystemsButtonText) : buttonTextProp;
  return (
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
};

export default NoRegisteredSystems;
