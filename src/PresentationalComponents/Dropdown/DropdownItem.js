import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const DropdownItem = ({
  className,
  children,
  component: Component,
  isDisabled,
  isSeparator,
  tabIndex,
  ...props
}) => {
  const DropCmp = isSeparator ? 'div' : Component;
  return (
    <DropCmp
      {...props}
      disabled={isDisabled}
      role={isSeparator ? 'separator' : 'menuitem'}
      tabIndex={isDisabled ? -1 : tabIndex}
      aria-disabled={isDisabled}
      className={classnames(
        isSeparator ? 'pf-c-dropdown__separator' : 'pf-c-dropdown__menu-item',
        isDisabled && 'pf-m-disabled',
        className
      )}>
      {children}
    </DropCmp>
  );
};

DropdownItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  component: PropTypes.node,
  isDisabled: PropTypes.bool,
  tabIndex: PropTypes.number
}

DropdownItem.defaultProps = {
  children: null,
  className: '',
  component: 'a',
  isDisabled: false
};

export default DropdownItem;