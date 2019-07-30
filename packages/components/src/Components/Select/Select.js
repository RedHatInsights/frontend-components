import React from 'react';
import PropTypes from 'prop-types';
import { variantToSelect, SelectVariant, calculateMulti, calculateOption } from './constants';
import {
    ValueContainer,
    MultiValueRemove,
    MultiValueContainer,
    DropdownIndicator,
    ClearIndicator,
    Option
} from './components';
import './select.scss';

const Select = ({ variant, isSearchable, className, simpleValue, ...props }) => {
    const SelectComponent = variantToSelect(variant);
    return (
        <SelectComponent
            className={`${className} ins-c-select`}
            menuPlacement="auto"
            closeMenuOnSelect={!props.isMulti}
            classNamePrefix="ins-c-select"
            components={{
                MultiValueContainer,
                ValueContainer,
                MultiValueRemove,
                DropdownIndicator,
                ClearIndicator,
                Option
            }}
            {...props}
            onChange={option => props.onChange(
                (simpleValue || variant === SelectVariant.creatable) ?
                calculateOption(option, props.isMulti) :
                option
            )}
            value={
                (simpleValue || variant === SelectVariant.creatable) ?
                calculateMulti(props.options, props.value, props.isMulti) :
                props.value
            }
            isSearchable={ [SelectVariant.creatable, SelectVariant.async].includes(variant) || isSearchable }
        />
    );
};

Select.propTypes = {
    selectVariant: PropTypes.oneOf(Object.keys(SelectVariant)),
    value: PropTypes.any,
    isSearchable: PropTypes.bool,
    className: PropTypes.string,
    showMoreLabel: PropTypes.string,
    simpleValue: PropTypes.bool,
    isCheckbox: PropTypes.bool,
    onChange: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.node
    })),
    hideSelectedOptions: PropTypes.bool
}

Select.defaultProps = {
    selectVariant: SelectVariant.default,
    isSearchable: false,
    className: '',
    simpleValue: true,
    isMulti: false,
    isCheckbox: false,
    value: '',
    showMoreLabel: 'more',
    showLessLabel: 'Show less',
    options: [],
    onChange: () => undefined,
    hideSelectedOptions: false
}

export default Select;
