import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Select, SelectOption, SelectVariant } from '@patternfly/react-core';
import Text from './TextFilter';
import isEqual from 'lodash/isEqual';

/**
 * CheckboxFilter is a part of the <a href="/components/ConditionalFilter">Conditional filter composite component</a>.
 * It was not designed to be used as a standalone component.
 */
class CheckboxFilter extends Component {
    state = {
        isExpanded: false,
        selected: []
    }

    componentDidUpdate({ value: prevSelected }) {
        const { value } = this.props;
        if (!isEqual(prevSelected, value)) {
            this.setState({
                selected: value
            });
        }
    }

    onToggle = isExpanded => {
        this.setState({
            isExpanded
        });
    };

    calculateSelected = () => {
        const { selected } = this.state;
        const { value } = this.props;
        return Array.from(new Set([
            ...(value && value.length > 0 && value.constructor === Array) ? value.map(item => item.value || item) : [],
            ...selected
        ]));
    }

    onSelect = (event, selection) => {
        const { onChange } = this.props;
        let newSelection = this.calculateSelected();
        if (newSelection.includes(selection)) {
            newSelection = newSelection.filter(item => item !== selection);
        } else {
            newSelection = [ ...newSelection, selection ];
        }

        onChange(event, newSelection, selection);
        this.setState({ selected: newSelection });
    };

    render() {
        const { isExpanded } = this.state;
        const { items, placeholder, isDisabled, className } = this.props;

        return (<Fragment>
            { !items || (items && items.length <= 0) ? <Text { ...this.props } value={ `${this.calculateSelected()}` } /> : <Select
                className={ className }
                variant={ SelectVariant.checkbox }
                aria-label="Select Input"
                onToggle={ this.onToggle }
                isDisabled={ isDisabled }
                onSelect={ this.onSelect }
                selections={ this.calculateSelected() }
                isOpen={ isExpanded }
                placeholderText={ placeholder }
            >
                { items.map(({ value, onClick, label, id, ...item }, key) => (
                    <SelectOption
                        { ...item }
                        key={ id || key }
                        value={ String(value || id || key) }
                        onClick={ e => onClick && onClick(e, { value, label, id, ...item }, key) }
                    >
                        { label }
                    </SelectOption>)
                ) }
            </Select> }
        </Fragment>);
    }
}

CheckboxFilter.propTypes = {
    /**
     * onChange event callback <br /><code>func(event, newSelection, currentSelection) => undefined</code>
     */
    onChange: PropTypes.func,
    /**
     * List of selected values
     */
    value: PropTypes.arrayOf(PropTypes.oneOfType([ PropTypes.string, PropTypes.shape({
        label: PropTypes.node,
        value: PropTypes.string
    }) ])),
    /**
     * Select value placeholder
     */
    placeholder: PropTypes.string,
    /**
     * List of available options
     */
    items: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.node,
        id: PropTypes.string,
        onClick: PropTypes.func
    })),
    /**
     * Disabled flag
     */
    isDisabled: PropTypes.bool,
    className: PropTypes.string
};

CheckboxFilter.defaultProps = {
    items: [],
    value: [],
    onChange: () => undefined,
    isDisabled: false
};

export default CheckboxFilter;
