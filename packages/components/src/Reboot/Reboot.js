import React from 'react';
import propTypes from 'prop-types';

import classNames from 'classnames';

import { RebootingIcon } from '@patternfly/react-icons';

import './reboot.scss';

const Reboot = ({ red, className, ...props }) => {
  const rebootIconClasses = classNames('ins-c-reboot', { [`ins-m-red`]: red }, className);

  return (
    <span className={rebootIconClasses} {...props}>
      <RebootingIcon />
      <span>Reboot required</span>
    </span>
  );
};

export default Reboot;

Reboot.propTypes = {
  className: propTypes.string,
  red: propTypes.bool,
};
