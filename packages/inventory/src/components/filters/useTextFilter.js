import { useState } from 'react';
import { TEXTUAL_CHIP } from '../../shared';

export const textFilterState = { textFilter: '' };
export const TEXT_FILTER = 'TEXT_FILTER';
export const textFilterReducer = (_state, { type, payload }) => ({
    ...type === TEXT_FILTER && {
        textFilter: payload
    }
});

export const useTextFilter = ([ state, dispatch ] = [ textFilterState ]) => {
    let [ value, setValue ] = useState('');
    if (dispatch) {
        value = state.textFilter;
        setValue = (newValue) => dispatch({ type: TEXT_FILTER, payload: newValue });
    }

    const filter = {
        label: 'Name',
        value: 'name-filter',
        filterValues: {
            placeholder: 'Filter by name',
            value,
            onChange: (_e, value) => setValue(value)
        }
    };
    const chip = value.length > 0 ? [{
        category: 'Display name',
        type: TEXTUAL_CHIP,
        chips: [
            { name: value }
        ]
    }] : [];
    return [ filter, chip, value, setValue ];
};
