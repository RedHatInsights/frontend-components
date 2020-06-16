import { useEffect, useState } from 'react';
import { TEXTUAL_CHIP } from '../../shared';

export const useTextFilter = (defaultValue) => {
    const [ value, setValue ] = useState('');
    useEffect(() => {
        if (defaultValue) {
            setValue(defaultValue);
        }
    }, [ defaultValue ]);
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
