import React from 'react';
import classNames from 'classnames';
import { RebootingIcon } from '@patternfly/react-icons';

import './reboot.scss';

export interface RebootProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  className?: string;
  red?: boolean;
}

const Reboot: React.FC<RebootProps> = ({ red, className, ...props }) => {
  const rebootIconClasses = classNames('ins-c-reboot', { [`ins-m-red`]: red }, className);

  return (
    <span className={rebootIconClasses} {...props}>
      <RebootingIcon />
      <span>Reboot required</span>
    </span>
  );
};

export default Reboot;
