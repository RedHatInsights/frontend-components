import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Dropdown, DropdownItem, DropdownToggle, DropdownToggleCheckbox, Checkbox } from '@patternfly/react-core';

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
        const { id, items, onSelect, checked, toggleProps, ...props } = this.props;

        return (
            <React.Fragment>
                { items && items.length > 0 ? <Dropdown
                    onSelect={ () => this.onToggle(false) }
                    { ...props }
                    toggle={ (
                        <DropdownToggle
                            { ...toggleProps }
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
                /> : <Checkbox
                    { ...props }
                    id={ `${id}-checkbox` }
                    isChecked={ checked }
                    onChange={ onSelect }
                /> }
            </React.Fragment>

        );
    }
}

BulkSelect.propTypes = {
    count: PropTypes.number,
    className: PropTypes.node,
    items: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        onClick: PropTypes.func
    })),
    checked: PropTypes.bool,
    id: PropTypes.string,
    onSelect: PropTypes.func,
    toggleProps: PropTypes.any
};

BulkSelect.defaultProps = {
    className: '',
    count: 0,
    items: [],
    checked: false,
    onSelect: () => undefined
};

export default BulkSelect;
