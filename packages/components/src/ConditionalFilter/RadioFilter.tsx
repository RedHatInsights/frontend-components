import React, { useState } from 'react';
import { MenuToggle, Radio, Select, SelectList, SelectOption } from '@patternfly/react-core';

import { FilterItem, FilterValue, isFilterValue } from './TextFilter';

export interface RadioFilterProps {
  /** Optional className. */
  className?: string;
  /** Optional disabled flag. */
  isDisabled?: boolean;
  /** Optional list of available options. */
  items?: FilterItem[];
  /** Optional onChange event callback. */
  onChange: (
    e: React.MouseEvent | React.ChangeEvent | React.FormEvent<HTMLInputElement> | undefined,
    newSelection: string | FilterValue | (string | FilterValue)[],
    selection?: string | FilterValue
  ) => void;
  /** Optional select value placeholder. */
  placeholder?: string;
  /** Optional list of selected values. */
  value?: string | FilterValue | Record<string, any>;
  /** Input element react ref for TextFilter */
  innerRef?: React.Ref<HTMLInputElement>;
}

/**
 * Component that works as a radio filter for ConditionalFilter component.
 *
 * It was not designed to be used as a standalone component, but rather within conditionalFilter.
 */
const RadioFilter: React.FunctionComponent<RadioFilterProps> = ({ items = [], onChange = () => undefined, isDisabled = false, ...props }) => {
  const { placeholder, className, value } = props;
  const [isExpanded, setExpanded] = useState(false);

  const calculateSelected = () => {
    if (value) {
      return isFilterValue(value) ? value.value : value;
    }
  };

  const onSelect = (event: React.MouseEvent<Element, MouseEvent> | React.ChangeEvent<Element> | undefined, selection: string | FilterValue) => {
    onChange(event, selection);
  };

  const checkedValue = calculateSelected();
  return (
    <Select
      className={className}
      aria-label="Select Input"
      toggle={(menuRef) => (
        <MenuToggle
          aria-label="Options menu"
          isExpanded={isExpanded}
          onClick={() => setExpanded((prev) => !prev)}
          isDisabled={isDisabled}
          ref={menuRef}
        >
          {placeholder}
        </MenuToggle>
      )}
      onOpenChange={(value) => setExpanded(value)}
      onSelect={(event, value) => onSelect(event, value as string | FilterValue)}
      isOpen={isExpanded}
      ouiaId={placeholder}
    >
      <SelectList aria-label="Options menu">
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
      </SelectList>
    </Select>
  );
};

export default RadioFilter;
