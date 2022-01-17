import { useState } from 'react';
import { TEXTUAL_CHIP } from '../../shared';

export const textFilterState = { textFilter: '' };
export const TEXT_FILTER = 'TEXT_FILTER';
export const textFilterReducer = (_state, { type, payload }) => ({
  ...(type === TEXT_FILTER && {
    textFilter: payload,
  }),
});

export const useTextFilter = ([state, dispatch] = [textFilterState]) => {
  const [stateValue, setStateValue] = useState('');
  const value = dispatch ? state.textFilter : stateValue;
  const setValue = dispatch ? (newValue) => dispatch({ type: TEXT_FILTER, payload: newValue }) : setStateValue;

  const filter = {
    label: 'Name',
    value: 'name-filter',
    filterValues: {
      placeholder: 'Filter by name',
      value,
      onChange: (_e, value) => setValue(value),
    },
  };
  const chip =
    value.length > 0
      ? [
          {
            category: 'Display name',
            type: TEXTUAL_CHIP,
            chips: [{ name: value }],
          },
        ]
      : [];
  return [filter, chip, value, setValue];
};
