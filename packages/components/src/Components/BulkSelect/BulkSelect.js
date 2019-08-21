import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Dropdown, DropdownItem, DropdownToggle, DropdownToggleCheckbox } from '@patternfly/react-core';

class BulkSelect extends Component {
    state = {
        isOpen: false
    }

    onToggle = (isOpen) => {
        this.setState({
            isOpen
        });
    }

    render() {
        const { isOpen } = this.state;
        const { id, items, onSelect, checked } = this.props;

        return (
            <Dropdown
                onSelect={ () => this.onToggle(false) }
                toggle={ (
                    <DropdownToggle
                        splitButtonItems={ [
                            <DropdownToggleCheckbox
                                id={ id ? `${id}-toggle-checkbox` : 'toggle-checkbox' }
                                key="split-checkbox"
                                aria-label="Select all"
                                onChange={ onSelect }
                                checked={ checked || false }
                            />
                        ] }
                        onToggle={ this.onToggle }
                    />
                ) }
                isOpen={ isOpen }
                dropdownItems={ items.map((oneItem, key) => <DropdownItem
                    component="button"
                    key={ oneItem.key || key }
                    onClick={ (event) => oneItem.onClick && oneItem.onClick(event, oneItem, key) }
                >
                    { oneItem.title }
                </DropdownItem>) }
            />
        );
    }
}

BulkSelect.propTypes = {
    count: PropTypes.number,
    clasName: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        onClick: PropTypes.func
    })),
    checked: PropTypes.bool,
    id: PropTypes.string,
    onSelect: PropTypes.func
};

BulkSelect.defaultProps = {
    clasName: '',
    count: 0,
    items: [],
    checked: false,
    onSelect: () => undefined
};

export default BulkSelect;
