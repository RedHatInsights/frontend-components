import './RebootRequired.scss';

import React from 'react';
import { Icon, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { PowerOffIcon } from '@patternfly/react-icons';
import { RuleDetailsMessages } from '../RuleDetails/RuleDetailsMessages';

interface RebootRequiredProps {
  rebootRequired: boolean;
  messages: RuleDetailsMessages;
}

const RebootRequired: React.FC<RebootRequiredProps> = ({ messages, rebootRequired }) => (
  <span className="system-reboot-message">
    <Icon>
      <PowerOffIcon className={rebootRequired ? 'reboot-required-icon' : 'no-reboot-required-icon'} />
    </Icon>
    <TextContent className="system-reboot-message__content">
      <Text component={TextVariants.p}>{messages.systemReboot}</Text>
    </TextContent>
  </span>
);

export default RebootRequired;
