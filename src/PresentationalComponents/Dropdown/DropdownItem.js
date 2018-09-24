import React from 'react';
import PropTypes from 'prop-types';
import { DropdownItem as PfDropdownItem, DropdownSeparator } from '@patternfly/react-core';

const DropdownItem = ({
    className,
    children,
    isDisabled,
    isSeparator,
    ...props
}) => {
    const DropCmp = isSeparator ? DropdownSeparator : PfDropdownItem;
    return (
        <DropCmp
            { ...props }
            isDisabled={ isDisabled }
            className={ className }>
            { children }
        </DropCmp>
    );
};

DropdownItem.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    component: PropTypes.node,
    isDisabled: PropTypes.bool
};

DropdownItem.defaultProps = {
    children: null,
    className: '',
    isDisabled: false
};

export default DropdownItem;
