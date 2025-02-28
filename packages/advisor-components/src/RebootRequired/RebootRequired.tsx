import './RebootRequired.scss';

import React from 'react';
import { Icon } from '@patternfly/react-core/dist/js/components/Icon/Icon';
import { Content, ContentVariants } from '@patternfly/react-core/dist/js/components/Content/Content';
import { PowerOffIcon } from '@patternfly/react-icons/dist/dynamic/icons/power-off-icon';
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
    <Content className="system-reboot-message__content">
      <Content component={ContentVariants.p}>{messages.systemReboot}</Content>
    </Content>
  </span>
);

export default RebootRequired;
