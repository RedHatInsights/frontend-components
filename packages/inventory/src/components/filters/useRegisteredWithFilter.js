import { useState } from 'react';
import { REGISTERED_CHIP, registered } from '../../shared';

export const useRegisteredWithFilter = () => {
    const [ registeredWithValue, setValue ] = useState([]);
    const filter = {
        label: 'Source',
        value: 'source-registered-with',
        type: 'checkbox',
        filterValues: {
            value: registeredWithValue,
            onChange: (_e, value) => setValue(value),
            items: registered
        }
    };
    const chip = registeredWithValue?.length > 0 ? [{
        category: 'Source',
        type: REGISTERED_CHIP,
        chips: registered.filter(({ value }) => registeredWithValue.includes(value))
        .map(({ label, ...props }) => ({ name: label, ...props }))
    }] : [];
    return [ filter, chip, registeredWithValue, setValue ];
};
