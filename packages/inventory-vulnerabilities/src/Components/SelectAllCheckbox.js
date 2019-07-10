import { Dropdown, DropdownItem, DropdownToggle, DropdownToggleCheckbox } from '@patternfly/react-core';
import propTypes from 'prop-types';
import React, { Component } from 'react';

class SelectAllCheckbox extends Component {
    state = { isOpen: false };

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.isOpen !== this.state.isOpen || nextProps.selectedItems !== this.props.selectedItems) {
            return true;
        }

        return false;
    }

    onToggle = isOpen => {
        this.setState({
            isOpen
        });
    };

    onSelect = event => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };
    componentDidMount() {}

    render() {
        const { selectedItems } = this.props;
        const checkboxlabel = Boolean(selectedItems) && `${selectedItems} selected`;
        const { isOpen } = this.state;
        const dropdownItems = [
            <DropdownItem key="none">Select none (0 items)</DropdownItem>,
            <DropdownItem key="page">Select page (x items)</DropdownItem>,
            <DropdownItem key="all">Select all (x items)</DropdownItem>
        ];
        return (
            <Dropdown
                onSelect={ this.onSelect }
                toggle={
                    <DropdownToggle
                        splitButtonItems={ [ <DropdownToggleCheckbox id="example-checkbox-1" key="checkbox" aria-label="Select all" />, checkboxlabel ] }
                        onToggle={ this.onToggle }
                    />
                }
                isOpen={ isOpen }
                dropdownItems={ dropdownItems }
            />
        );
    }
}

SelectAllCheckbox.propTypes = {
    selectedItems: propTypes.number
};

export default SelectAllCheckbox;
