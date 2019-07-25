import CreatableSelect from 'react-select/creatable';
import Async from 'react-select/async';
import ReactSelect from 'react-select';

export const CLEAR_INDICATOR = 'clearIndicator';

export const SelectVariant = {
    default: 'default',
    creatable: 'creatable',
    async: 'async'
}

export const variantToSelect = (type) => ({
    [SelectVariant.default]: ReactSelect,
    [SelectVariant.creatable]: CreatableSelect,
    [SelectVariant.async]: Async
})[type] || ReactSelect;

export function calculateMulti(options, selectValue, isMulti) {
    return options.filter(({ value }) => (
        isMulti ? (selectValue && selectValue.includes(value)) : value === selectValue)
    )
}

export function calculateOption(option, isMulti) {
    if (option) {
        return isMulti && Array.isArray(option) ? option.map(({ value }) => value) : option.value || option;
    }
}
