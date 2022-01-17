import { useState } from 'react';
import { REGISTERED_CHIP, registered } from '../../shared';

export const registeredWithFilterState = { registeredWithFilter: [] };
export const REGISTERED_WITH_FILTER = 'REGISTERED_WITH_FILTER';
export const registeredWithFilterReducer = (_state, { type, payload }) => ({
  ...(type === REGISTERED_WITH_FILTER && {
    registeredWithFilter: payload,
  }),
});

export const useRegisteredWithFilter = ([state, dispatch] = [registeredWithFilterState]) => {
  let [registeredWithStateValue, setStateValue] = useState([]);
  const registeredWithValue = dispatch ? state.registeredWithFilter : registeredWithStateValue;
  const setValue = dispatch ? (newValue) => dispatch({ type: REGISTERED_WITH_FILTER, payload: newValue }) : setStateValue;

  const filter = {
    label: 'Source',
    value: 'source-registered-with',
    type: 'checkbox',
    filterValues: {
      value: registeredWithValue,
      onChange: (_e, value) => setValue(value),
      items: registered,
    },
  };
  const chip =
    registeredWithValue?.length > 0
      ? [
          {
            category: 'Source',
            type: REGISTERED_CHIP,
            chips: registered.filter(({ value }) => registeredWithValue.includes(value)).map(({ label, ...props }) => ({ name: label, ...props })),
          },
        ]
      : [];
  return [filter, chip, registeredWithValue, setValue];
};
