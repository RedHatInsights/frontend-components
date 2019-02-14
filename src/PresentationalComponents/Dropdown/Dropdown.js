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
    hasArrow,
    isCollapsed,
    onSelect,
    children,
    onToggle,
    widgetId,
    ...props
}) => {
    const Toggle = isKebab ? KebabToggle : DropdownToggle;
    console.warn('Dropdown from FE component shouldn\'t be used anymore. \
Instead use http://patternfly-react.surge.sh/patternfly-4/components/dropdown#Dropdown from PF repository.');
    const extraToggleProps = {
        ...!hasArrow ? { iconComponent: null } : {}
    };
    return (
        <PfDropdown
            widget-type='InsightsDropdown'
            { ...props }
            className={ className }
            widget-id={ widgetId }
            position={ position }
            direction={ direction }
            onSelect={ onSelect }
            isOpen={ !isCollapsed }
            toggle={ <Toggle { ...extraToggleProps } onToggle={ isOpen => onToggle(undefined, !isOpen) }>{ title }</Toggle> }
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
    title: PropTypes.node.isRequired,
    isCollapsed: PropTypes.bool,
    hasArrow: PropTypes.bool,
    onSelect: PropTypes.func,
    onToggle: PropTypes.func,
    widgetId: PropTypes.string
};

Dropdown.defaultProps = {
    widgetId: generateID('Dropdown'),
    onToggle: () => undefined,
    hasArrow: true,
    isCollapsed: true
};

export default Dropdown;
