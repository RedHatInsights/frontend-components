import React from 'react';
import PropTypes from 'prop-types';
import { generateID } from '../../functions/generateID.js';

import {
    Dropdown as PfDropdown,
    DropdownToggle,
    KebabToggle,
    DropdownDirection,
    DropdownPosition
} from '@patternfly/react-core';

export { DropdownDirection, DropdownPosition } from '@patternfly/react-core';

const Dropdown = ({
    position,
    direction,
    isKebab,
    className,
    title,
    hasArrow = true,
    isCollapsed = true,
    onSelect,
    children,
    airaLabelledBy,
    onToggle,
    ...props
}) => {
    const Toggle = isKebab ? KebabToggle : DropdownToggle;

    return (
        <PfDropdown
            widget-type='InsightsDropdown'
            widget-id={ generateID('Dropdown') }
            { ...props }
            className={ className }
            isPlain={ !hasArrow }
            position={ position }
            direction={ direction }
            onSelect={ onSelect }
            isOpen={ !isCollapsed }
            toggle={ <Toggle onToggle={ isOpen => onToggle(undefined, !isOpen) }>{ title }</Toggle> }
        >
            { children }
        </PfDropdown>
    );
};

Dropdown.propTypes = {
    position: PropTypes.oneOf(Object.keys(DropdownPosition)),
    direction: PropTypes.oneOf(Object.keys(DropdownDirection)),
    isKebab: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    title: PropTypes.string.isRequired,
    isCollapsed: PropTypes.bool,
    hasArrow: PropTypes.bool,
    onSelect: PropTypes.func,
    airaLabelledBy: PropTypes.string,
    onToggle: PropTypes.func
};

export default Dropdown;
