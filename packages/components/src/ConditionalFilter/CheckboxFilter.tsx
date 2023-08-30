import React, { useState } from 'react';
import { Badge, MenuToggle, Select, SelectList, SelectOption, SelectProps } from '@patternfly/react-core';

import omit from 'lodash/omit';
import { FilterItem, FilterValue, isFilterValue } from './TextFilter';

export type CheckboxFilterValue = undefined | string | number | boolean | FilterValue;

export interface CheckboxFilterProps {
  /** Optional onChange event callback. */
  onChange: (
    e: React.MouseEvent | React.ChangeEvent | React.FormEvent<HTMLInputElement> | undefined,
    newSelection: CheckboxFilterValue[],
    selection?: CheckboxFilterValue
  ) => void;
  /** Optional list of selected values. */
  value?: CheckboxFilterValue[];
  /** Optional select value placeholder. */
  placeholder?: string;
  /** Optional list of available options. */
  items?: FilterItem[];
  /** Optional disabled flag. */
  isDisabled?: boolean;
  /** Optional className. */
  className?: string;
}

function calculateSelected(value: CheckboxFilterProps['value'], selected: CheckboxFilterValue[]): CheckboxFilterValue[] {
  return Array.from(
    new Set([
      ...(value && (value as CheckboxFilterValue[]).length > 0 && value.constructor === Array
        ? value.map((item) => {
            return isFilterValue(item) ? item.value : item;
          })
        : []),
      ...selected,
    ])
  );
}

/**
 * Component that works as a checkbox filter for ConditionalFilter component.
 *
 * It was not designed to be used as a standalone component, but rather within conditionalFilter.
 */
const CheckboxFilter: React.FunctionComponent<CheckboxFilterProps> = ({ items = [], value = [], onChange, isDisabled = false, ...props }) => {
  const { placeholder, className } = props;
  const [isExpanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<CheckboxFilterValue[]>(calculateSelected(value, []));

  const onSelect = (event: React.MouseEvent<Element, MouseEvent> | React.ChangeEvent<Element> | undefined, selection: CheckboxFilterValue) => {
    let newSelection = calculateSelected(value, selected);
    newSelection = newSelection.includes(selection) ? newSelection.filter((item) => item !== selection) : [...newSelection, selection];

    onChange?.(event, newSelection, selection);
    setSelected(newSelection);
  };

  const toggle: SelectProps['toggle'] = (toggleRef) => (
    <MenuToggle
      aria-label="Options menu"
      isDisabled={isDisabled}
      onClick={() => setExpanded((prev) => !prev)}
      ref={toggleRef}
      isExpanded={isExpanded}
      isFullWidth
    >
      {placeholder}
      {selected.length > 0 && (
        <Badge className="pf-v5-u-ml-sm" isRead>
          {selected.length}
        </Badge>
      )}
    </MenuToggle>
  );

  return (
    <Select
      role="menu"
      toggle={toggle}
      className={className}
      onOpenChange={(isExpanded) => setExpanded(isExpanded)}
      onSelect={(event, value) => onSelect(event, value)}
      isOpen={isExpanded}
      placeholder={placeholder}
      ouiaId={placeholder}
    >
      <SelectList aria-label="Options menu">
        {items.map(({ value, onClick, label, id, ...item }, key) => (
          <SelectOption
            hasCheckbox
            isSelected={selected.includes(value)}
            {...omit(item, 'onChange')}
            key={id || key}
            value={String(value || id || key)}
            onClick={(e) => onClick?.(e, { value, label, id, ...item }, key)}
          >
            {label}
          </SelectOption>
        ))}
      </SelectList>
    </Select>
  );
};

export default CheckboxFilter;
