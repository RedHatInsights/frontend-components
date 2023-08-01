import React, { Fragment, useState } from 'react';
import { Badge, MenuToggle, Select, SelectList, SelectOption, SelectProps } from '@patternfly/react-core';

import omit from 'lodash/omit';
import TextFilter, { FilterItem, FilterValue, isFilterValue } from './TextFilter';

export interface CheckboxFilterProps {
  /** Optional onChange event callback. */
  onChange?: (
    e: React.MouseEvent | React.ChangeEvent | React.FormEvent<HTMLInputElement> | undefined,
    newSelection: string | FilterValue | (string | FilterValue)[],
    selection?: string | FilterValue
  ) => void;
  /** Optional list of selected values. */
  value?: string | FilterValue | (string | FilterValue)[] | Record<string, unknown>;
  /** Optional select value placeholder. */
  placeholder?: string;
  /** Optional list of available options. */
  items?: FilterItem[];
  /** Optional disabled flag. */
  isDisabled?: boolean;
  /** Optional className. */
  className?: string;
}

/**
 * Component that works as a checkbox filter for ConditionalFilter component.
 *
 * It was not designed to be used as a standalone component, but rather within conditionalFilter.
 */
const CheckboxFilter: React.FunctionComponent<CheckboxFilterProps> = ({
  items = [],
  value = [],
  onChange = () => undefined,
  isDisabled = false,
  ...props
}) => {
  const { placeholder, className } = props;
  const [isExpanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<(string | FilterValue)[]>([]);

  const calculateSelected = () =>
    Array.from(
      new Set([
        ...(value && (value as (string | FilterValue)[]).length > 0 && value.constructor === Array
          ? value.map((item) => {
              return isFilterValue(item) ? item.value : item;
            })
          : []),
        ...selected,
      ])
    );

  const onSelect = (event: React.MouseEvent<Element, MouseEvent> | React.ChangeEvent<Element> | undefined, selection: string | FilterValue) => {
    let newSelection = calculateSelected();
    newSelection = newSelection.includes(selection) ? newSelection.filter((item) => item !== selection) : [...newSelection, selection];

    onChange?.(event, newSelection, selection);
    setSelected(newSelection);
  };

  const toggle: SelectProps['toggle'] = (toggleRef) => (
    <MenuToggle isDisabled={isDisabled} onClick={() => setExpanded((prev) => !prev)} ref={toggleRef} isExpanded={isExpanded}>
      {placeholder}
      {selected.length > 0 && (
        <Badge className="pf-v5-u-ml-sm" isRead>
          {selected.length}
        </Badge>
      )}
    </MenuToggle>
  );

  return (
    <Fragment>
      {!items || (items && items.length <= 0) ? (
        <TextFilter {...props} onChange={onChange} isDisabled={isDisabled} value={`${calculateSelected()}`} />
      ) : (
        <Select
          toggle={toggle}
          className={className}
          aria-label="Select Input"
          onOpenChange={(isExpanded) => setExpanded(isExpanded)}
          onSelect={(event, value) => onSelect(event, value as string | FilterValue)}
          isOpen={isExpanded}
          placeholder={placeholder}
          ouiaId={placeholder}
        >
          <SelectList>
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
      )}
    </Fragment>
  );
};

export default CheckboxFilter;
