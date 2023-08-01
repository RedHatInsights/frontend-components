import React, { Fragment, useState } from 'react';
import { Radio } from '@patternfly/react-core';
import { Select, SelectOption, SelectVariant } from '@patternfly/react-core/deprecated';

import TextFilter, { FilterItem, FilterValue, isFilterValue } from './TextFilter';

export interface RadioFilterProps {
  /** Optional className. */
  className?: string;
  /** Optional disabled flag. */
  isDisabled?: boolean;
  /** Optional list of available options. */
  items?: FilterItem[];
  /** Optional onChange event callback. */
  onChange?: (
    e: React.MouseEvent | React.ChangeEvent | React.FormEvent<HTMLInputElement>,
    newSelection: string | FilterValue | (string | FilterValue)[],
    selection?: string | FilterValue
  ) => void;
  /** Optional select value placeholder. */
  placeholder?: string;
  /** Optional list of selected values. */
  value?: string | FilterValue | (string | FilterValue)[] | Record<string, unknown>;
}

/**
 * Component that works as a radio filter for ConditionalFilter component.
 *
 * It was not designed to be used as a standalone component, but rather within conditionalFilter.
 */
const RadioFilter: React.FunctionComponent<RadioFilterProps> = ({ items = [], onChange = () => undefined, isDisabled = false, ...props }) => {
  const { placeholder, className, value } = props;
  const selectedValue = value as string | FilterValue;
  const [isExpanded, setExpanded] = useState(false);
  const [checked, setChecked] = useState<string | FilterValue>();

  const calculateSelected = () => {
    if (selectedValue) {
      return isFilterValue(selectedValue) ? (selectedValue as FilterValue).value : selectedValue;
    } else if (checked) {
      return isFilterValue(checked) ? checked.value : checked;
    }
  };

  const onSelect = (event: React.MouseEvent<Element, MouseEvent> | React.ChangeEvent<Element>, selection: string | FilterValue) => {
    onChange?.(event, selection);
    setChecked(selection);
  };

  const checkedValue = calculateSelected();
  return (
    <Fragment>
      {!items || (items && items.length <= 0) ? (
        <TextFilter {...props} onChange={onChange} isDisabled={isDisabled} value={`${calculateSelected()}`} />
      ) : (
        <Select
          className={className}
          variant={SelectVariant.single}
          aria-label="Select Input"
          isDisabled={isDisabled}
          onToggle={(_e, value) => setExpanded(value)}
          onSelect={(event, value) => onSelect(event, value as string | FilterValue)}
          isOpen={isExpanded}
          placeholderText={placeholder}
          ouiaId={placeholder}
        >
          {items.map(({ value, isChecked, onChange, label, id, ...item }, key) => (
            <SelectOption {...item} key={id || key} value={value || '' + key}>
              <Radio
                name={id || `${key}-radio`}
                label={label}
                value={value || key}
                isChecked={
                  isChecked ||
                  (checkedValue !== undefined && checkedValue === value) ||
                  (checkedValue !== undefined && checkedValue === '' + key) ||
                  false
                }
                onChange={(e) => onChange?.(e, { id, label, value, isChecked, ...item }, key)}
                id={id || `${value}-${key}`}
              />
            </SelectOption>
          ))}
        </Select>
      )}
    </Fragment>
  );
};

export default RadioFilter;
