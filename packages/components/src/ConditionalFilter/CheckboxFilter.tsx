import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Select, SelectOption, SelectVariant } from '@patternfly/react-core';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import TextFilter, { FilterItem, FilterValue, isFilterValue } from './TextFilter';

export interface CheckboxFilterProps {
  /** Optional onChange event callback. */
  onChange?: (
    e: React.MouseEvent | React.ChangeEvent | React.FormEvent<HTMLInputElement>,
    newSelection: string | FilterValue | (string | FilterValue)[],
    selection?: string | FilterValue
  ) => void;
  /** Optional list of selected values. */
  value?: (string | FilterValue)[];
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
 * It was not designed to be used as a standalone component.
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
  const prevSelected = useRef(selected);

  const changeSelected = (value: (string | FilterValue)[]) => {
    prevSelected.current = selected;
    setSelected(value);
  };

  useEffect(() => {
    !isEqual(prevSelected.current, value) && value && changeSelected(value);
  }, [selected, value]);

  const calculateSelected = () =>
    Array.from(
      new Set([
        ...(value && value.length > 0 && value.constructor === Array
          ? value.map((item) => {
              return isFilterValue(item) ? item.value : item;
            })
          : []),
        ...selected,
      ])
    );

  const onSelect = (event: React.MouseEvent<Element, MouseEvent> | React.ChangeEvent<Element>, selection: string | FilterValue) => {
    let newSelection = calculateSelected();
    newSelection = newSelection.includes(selection) ? newSelection.filter((item) => item !== selection) : [...newSelection, selection];

    onChange?.(event, newSelection, selection);
    changeSelected(newSelection);
  };

  return (
    <Fragment>
      {!items || (items && items.length <= 0) ? (
        <TextFilter {...props} onChange={onChange} isDisabled={isDisabled} value={`${calculateSelected()}`} />
      ) : (
        <Select
          className={className}
          variant={SelectVariant.checkbox}
          aria-label="Select Input"
          onToggle={(isExpanded) => setExpanded(isExpanded)}
          isDisabled={isDisabled}
          onSelect={(event, value) => onSelect(event, value as string | FilterValue)}
          selections={calculateSelected()}
          isOpen={isExpanded}
          placeholderText={placeholder}
          ouiaId={placeholder}
        >
          {items.map(({ value, onClick, label, id, ...item }, key) => (
            <SelectOption
              {...omit(item, 'onChange')}
              key={id || key}
              value={String(value || id || key)}
              onClick={(e) => onClick?.(e, { value, label, id, ...item }, key)}
            >
              {label}
            </SelectOption>
          ))}
        </Select>
      )}
    </Fragment>
  );
};

export default CheckboxFilter;
