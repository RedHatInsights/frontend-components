import React, { Fragment, useState } from 'react';
import { Select, SelectOption, SelectVariant, Radio } from '@patternfly/react-core';
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
  value?: string | FilterValue;
}

/**
 * Component that works as a radio filter for ConditionalFilter component.
 *
 * It was not designed to be used as a standalone component.
 */
const RadioFilter: React.FunctionComponent<RadioFilterProps> = ({ items = [], onChange = () => undefined, isDisabled = false, ...props }) => {
  const { placeholder, className, value: selectedValue } = props;
  const [isExpanded, setExpanded] = useState(false);
  const [checked, setChecked] = useState<string | FilterValue>();

  const calculateSelected = () => {
    if (selectedValue) {
      return isFilterValue(selectedValue) ? selectedValue.value : selectedValue;
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
          onToggle={(value) => setExpanded(value)}
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
                onChange={(_value, e) => onChange?.(e, { id, label, value, isChecked, ...item }, key)}
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
