import './RebootRequired.scss';

import React from 'react';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { PowerOffIcon } from '@patternfly/react-icons';

import { RuleDetailsMessages } from '../RuleDetails/RuleDetails';

interface RebootRequiredProps {
  rebootRequired: boolean;
  messages: RuleDetailsMessages;
}

const RebootRequired: React.FC<RebootRequiredProps> = ({ messages, rebootRequired }) => {
  return (
    <span className="system-reboot-message">
      <PowerOffIcon className={rebootRequired ? 'reboot-required-icon' : 'no-reboot-required-icon'} />
      <TextContent className="system-reboot-message__content">
        <Text component={TextVariants.p}>{messages.systemReboot}</Text>
      </TextContent>
    </span>
  );
};

export default RebootRequired;
