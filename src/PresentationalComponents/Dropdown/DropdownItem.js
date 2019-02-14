import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropdownItem as PfDropdownItem, DropdownSeparator } from '@patternfly/react-core';

class DropdownItem extends Component {
    render() {
        const {
            className,
            children,
            isDisabled,
            isSeparator,
            ...props
        } = this.props;

        const DropCmp = isSeparator ? DropdownSeparator : PfDropdownItem;

        console.warn('DropdownItem from FE component shouldn\'t be used anymore. \
Instead use http://patternfly-react.surge.sh/patternfly-4/components/dropdown#DropdownItem from PF repository.');
        return (
            <DropCmp
                { ...props }
                isDisabled={ isDisabled }
                className={
                    isSeparator ?
                        className.split(' ').filter(oneClass => oneClass !== 'pf-c-dropdown__menu-item').join(' ') :
                        className
                } >
                { !isSeparator && children }
            </DropCmp>
        );
    }
}

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
