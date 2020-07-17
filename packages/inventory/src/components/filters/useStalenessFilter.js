import { useState } from 'react';
import { STALE_CHIP, staleness } from '../../shared';

export const stalenessFilterState = { stalenessFilter: [] };
export const STALENESS_FILTER = 'STALENESS_FILTER';
export const stalenessFilterReducer = (_state, { type, payload }) => ({
    ...type === STALENESS_FILTER && {
        stalenessFilter: payload
    }
});

export const useStalenessFilter = ([ state, dispatch ] = [ stalenessFilterState ]) => {
    let [ stalenessValue, setValue ] = useState([]);
    if (dispatch) {
        stalenessValue = state.stalenessFilter;
        setValue = (newValue) => dispatch({ type: STALENESS_FILTER, payload: newValue });
    }

    const filter = {
        label: 'Status',
        value: 'stale-status',
        type: 'checkbox',
        filterValues: {
            value: stalenessValue,
            onChange: (_e, value) => setValue(value),
            items: staleness
        }
    };
    const chip = stalenessValue?.length > 0 ? [{
        category: 'Status',
        type: STALE_CHIP,
        chips: staleness.filter(({ value }) => stalenessValue.includes(value))
        .map(({ label, ...props }) => ({ name: label, ...props }))
    }] : [];
    return [ filter, chip, stalenessValue, setValue ];
};
