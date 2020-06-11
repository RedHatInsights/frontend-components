import { useState } from 'react';
import { STALE_CHIP, staleness } from '../../shared';

export const useStalenessFilter = () => {
    const [ stalenessValue, setValue ] = useState([]);
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
