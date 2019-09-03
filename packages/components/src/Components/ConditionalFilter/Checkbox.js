import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Select, SelectOption, SelectVariant } from '@patternfly/react-core';
import Text from './Text';

class Checkbox extends Component {
    state = {
        isExpanded: false,
        selected: []
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
        const { items, placeholder, className } = this.props;

        return (<Fragment>
            { !items || (items && items.length <= 0) ? <Text { ...this.props } value={ `${this.calculateSelected()}` } /> : <Select
                className={ className }
                variant={ SelectVariant.checkbox }
                aria-label="Select Input"
                onToggle={ this.onToggle }
                onSelect={ this.onSelect }
                selections={ this.calculateSelected() }
                isExpanded={ isExpanded }
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

Checkbox.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.arrayOf(PropTypes.oneOfType([ PropTypes.string, PropTypes.shape({
        label: PropTypes.node,
        value: PropTypes.string
    }) ])),
    placeholder: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.node,
        id: PropTypes.string,
        onClick: PropTypes.func
    }))
};

Checkbox.defaultProps = {
    items: [],
    value: [],
    onChange: () => undefined
};

export default Checkbox;
