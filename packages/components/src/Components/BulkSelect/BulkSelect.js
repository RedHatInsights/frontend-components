import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Dropdown, DropdownItem, DropdownToggle, DropdownToggleCheckbox, Checkbox } from '@patternfly/react-core';

class BulkSelect extends Component {
    state = {
        isOpen: false,
        hasError: false
    }

    componentDidCatch = () => {
        console.error('Above error is caused because you are using outdated PF react core library. Count will not be \
visible unless you update it.');
        this.setState({ hasError: true });
    }

    onToggle = (isOpen) => {
        this.setState({
            isOpen
        });
    }

    render() {
        const { isOpen, hasError } = this.state;
        const { id, items, onSelect, checked, toggleProps, count, className, ...props } = this.props;

        return (
            <Fragment>
                { items && items.length > 0 ? <Dropdown
                    onSelect={ () => this.onToggle(false) }
                    { ...props }
                    className={ classnames(className, 'ins-c-bulk-select') }
                    toggle={ (
                        <DropdownToggle
                            { ...toggleProps }
                            splitButtonItems={ [
                                <Fragment key="split-checkbox">
                                    {
                                        hasError ? <DropdownToggleCheckbox
                                            id={ id ? `${id}-toggle-checkbox` : 'toggle-checkbox' }
                                            aria-label="Select all"
                                            onChange={ onSelect }
                                            checked={ checked || false }
                                        /> :
                                            <DropdownToggleCheckbox
                                                id={ id ? `${id}-toggle-checkbox` : 'toggle-checkbox' }
                                                aria-label="Select all"
                                                onChange={ onSelect }
                                                checked={ checked || false }
                                            >{ count ? `${count} selected` : '' }</DropdownToggleCheckbox>
                                    }
                                </Fragment>
                            ] }
                            onToggle={ this.onToggle }
                        />
                    ) }
                    isOpen={ isOpen }
                    dropdownItems={ [
                        ...count !== undefined && count > 0 ? [
                            <DropdownItem
                                key="count"
                                isDisabled
                                className={ !hasError ? 'ins-c-bulk-select__selected' : '' }
                            >
                                { count } Selected
                            </DropdownItem>
                        ] : [],
                        ...items.map((oneItem, key) => <DropdownItem
                            component="button"
                            key={ oneItem.key || key }
                            onClick={ (event) => oneItem.onClick && oneItem.onClick(event, oneItem, key) }
                        >
                            { oneItem.title }
                        </DropdownItem>)
                    ] }
                /> : <Checkbox
                    { ...props }
                    className={ classnames(className, 'ins-c-bulk-select') }
                    id={ `${id}-checkbox` }
                    isChecked={ checked }
                    onChange={ onSelect }
                /> }
            </Fragment>

        );
    }
}

BulkSelect.propTypes = {
    count: PropTypes.number,
    className: PropTypes.string,
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
