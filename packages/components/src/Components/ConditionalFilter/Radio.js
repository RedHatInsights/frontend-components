import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Select, SelectOption, SelectVariant, Radio as InputRadio } from '@patternfly/react-core';
import Text from './Text';

class Radio extends Component {
    state = {
        isExpanded: false,
        checked: undefined
    }

    onToggle = isExpanded => {
        this.setState({
            isExpanded
        });
    };

    calculateSelected = () => {
        const { checked } = this.state;
        const { value: selectedValue } = this.props;
        return (selectedValue && (selectedValue.value || selectedValue)) || (checked && (checked.value || checked));
    }

    onSelect = (event, selection) => {
        const { onChange } = this.props;
        onChange(event, selection);
        this.setState({ checked: selection });
    };

    clearSelection = () => {
        this.setState({
            selected: []
        });
    };

    render() {
        const { isExpanded } = this.state;
        const { items, placeholder } = this.props;
        const checkedValue = this.calculateSelected();
        return (<Fragment>
            { !items || (items && items.length <= 0) ?
                <Text
                    { ...this.props }
                    value={ `${this.calculateSelected()}` }
                /> :
                <Select
                    variant={ SelectVariant.single }
                    aria-label="Select Input"
                    onToggle={ this.onToggle }
                    onSelect={ this.onSelect }
                    isExpanded={ isExpanded }
                    placeholderText={ placeholder }
                >
                    { items.map(({ value, isChecked, label, id, ...item }, key) => (
                        <SelectOption { ...item } key={ id || key } value={ value }>
                            <InputRadio
                                { ...item }
                                name={ id || `${key}-radio` }
                                label={ label }
                                value={ value }
                                isChecked={ item.isChecked || (checkedValue === value) || false }
                                onChange={ () => undefined }
                                id={ id || `${value}-${key}` }
                            />
                        </SelectOption>)
                    ) }
                </Select> }
        </Fragment>);
    }
}

Radio.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([ PropTypes.string, PropTypes.shape({
        label: PropTypes.node,
        value: PropTypes.string
    }) ]),
    placeholder: PropTypes.string
};

Radio.defaultProps = {
    items: [],
    onChange: () => undefined
};

export default Radio;
