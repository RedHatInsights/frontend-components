import './RebootRequired.scss';

import React from 'react';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { PowerOffIcon } from '@patternfly/react-icons'; // TODO: change PF imports
import { useIntl } from 'react-intl';

import messages from '../messages';

interface RebootRequiredProps {
  reboot_required: boolean;
}

const RebootRequired: React.FC<RebootRequiredProps> = (reboot_required) => {
  const intl = useIntl();

  return (
    <span className="system-reboot-message">
      <PowerOffIcon className={reboot_required ? 'reboot-required-icon' : 'no-reboot-required-icon'} />
      <TextContent className="system-reboot-message__content">
        <Text component={TextVariants.p}>
          {intl.formatMessage(messages.systemReboot, {
            strong: (str) => <strong>{str}</strong>,
            status: reboot_required ? intl.formatMessage(messages.is) : intl.formatMessage(messages.isNot),
          })}
        </Text>
      </TextContent>
    </span>
  );
};

export default RebootRequired;
