import { useIntlWithFallback } from '@redhat-cloud-services/frontend-components-translations/localization';
import React, { useState } from 'react';
import { MenuToggle } from '@patternfly/react-core/dist/dynamic/components/MenuToggle';
import { Radio } from '@patternfly/react-core/dist/dynamic/components/Radio';
import { Select } from '@patternfly/react-core/dist/dynamic/components/Select';
import { SelectList } from '@patternfly/react-core/dist/dynamic/components/Select';
import { SelectOption } from '@patternfly/react-core/dist/dynamic/components/Select';

import { FilterItem, FilterValue, isFilterValue } from './TextFilter';
import messages from '../messages';

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
    selection?: string | FilterValue,
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
const RadioFilter = ({ items = [], onChange = () => undefined, isDisabled = false, ...props }: RadioFilterProps) => {
  const intl = useIntlWithFallback();

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
      aria-label={intl.formatMessage(messages.radioFilterSelectInput)}
      toggle={(menuRef) => (
        <MenuToggle
          aria-label={intl.formatMessage(messages.radioFilterOptionsMenu)}
          isExpanded={isExpanded}
          onClick={() => setExpanded((prev) => !prev)}
          isDisabled={isDisabled}
          ref={menuRef}
          isFullWidth
        >
          {placeholder}
        </MenuToggle>
      )}
      onOpenChange={(value) => setExpanded(value)}
      onSelect={(event, value) => onSelect(event, value as string | FilterValue)}
      isOpen={isExpanded}
      ouiaId={placeholder}
      popperProps={{ appendTo: 'inline' }}
    >
      <SelectList aria-label={intl.formatMessage(messages.radioFilterOptionsMenu)}>
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
