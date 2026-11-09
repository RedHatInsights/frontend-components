import { useIntlWithFallback } from '@redhat-cloud-services/frontend-components-translations/localization';
import React from 'react';
import classNames from 'classnames';
import RebootingIcon from '@patternfly/react-icons/dist/dynamic/icons/rebooting-icon';

import './reboot.scss';
import messages from '../messages';

export interface RebootProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  className?: string;
  red?: boolean;
  /** Localized reboot-required message. */
  text?: React.ReactNode;
}

const Reboot = ({ red, className, text: textProp, ...props }: RebootProps) => {
  const intl = useIntlWithFallback();
  const text = textProp === undefined ? intl.formatMessage(messages.rebootText) : textProp;

  const rebootIconClasses = classNames('ins-c-reboot', { [`ins-m-red`]: red }, className);

  return (
    <span className={rebootIconClasses} {...props}>
      <RebootingIcon />
      <span>{text}</span>
    </span>
  );
};

export default Reboot;
