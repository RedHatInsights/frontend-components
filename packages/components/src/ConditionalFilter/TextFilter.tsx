import React, { FormEvent, Fragment, MouseEventHandler, ReactNode, useState } from 'react';
import { Icon, TextInput } from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import './conditional-filter.scss';

export function isFilterValue(item: string | FilterValue): item is FilterValue {
  return (item as FilterValue).value !== undefined;
}
export interface FilterItem {
  /** Item label. */
  label: ReactNode;
  /** Optional item name. */
  name?: string;
  /** Item value. */
  value: string;
  /** Item identifier. */
  id: string;
  /** Optional onChange event callback. */
  onChange?: (e: FormEvent, item: FilterItem, key: number) => void;
  /** Optional onClick event callback. */
  onClick?: (e?: FormEvent | MouseEventHandler<HTMLInputElement>, item?: FilterItem, key?: number, checked?: boolean) => void;
  /** Optional isChecked flag. */
  isChecked?: boolean;
}

export interface FilterValue {
  /** Label. */
  label: ReactNode;
  /** Value string. */
  value: string;
}

export interface TextFilterProps {
  /** Optional text filter value. */
  value?: string | FilterValue | (string | FilterValue)[] | Record<string, unknown>;
  /** Optional text filter placeholder. */
  placeholder?: string;
  /** Optional onChange event called on input change. */
  onChange?: (
    e: React.MouseEvent | React.ChangeEvent | React.FormEvent<HTMLInputElement>,
    newSelection: string | FilterValue | (string | FilterValue)[],
    selection?: string | FilterValue
  ) => void;
  /** Optional onSubmit event called on Enter press. */
  onSubmit?: (e: React.FormEvent<HTMLInputElement>, value: string) => void;
  /** Optional input disabled state indicator. */
  isDisabled?: boolean;
  /** Optional aria-label value. */
  'aria-label'?: string;
  /** Optional id value. */
  id?: string;
  /** Optional icon component. */
  icon?: React.FunctionComponent;
  /** Optional className. */
  className?: string;
  /** Input element react ref */
  innerRef?: React.Ref<HTMLInputElement>;
}

/**
 * Component that works as a text filter for ConditionalFilter component.
 *
 * This component accepts onChange event called on input change
 * and onSubmit event called on Enter press.
 *
 * It was not designed to be used as a standalone component, but rather within conditionalFilter.
 */
const TextFilter: React.FunctionComponent<TextFilterProps> = ({
  icon,
  id,
  isDisabled = false,
  className,
  onChange,
  onSubmit = () => undefined,
  value = '',
  placeholder,
  innerRef,
  ...props
}) => {
  const filterValue = value as string | FilterValue;
  const [stateValue, setStateValue] = useState('');
  const InternalIcon = icon || SearchIcon;
  const changeCallback = (e: React.FormEvent<HTMLInputElement>, value: string) => (onChange ? onChange(e, value) : setStateValue(value));

  return (
    <Fragment>
      <TextInput
        aria-label={props['aria-label'] || 'text input'}
        className={`ins-c-conditional-filter ${className || ''}`}
        data-ouia-component-type="PF4/TextInput"
        id={id}
        isDisabled={isDisabled}
        value={(onChange ? (typeof value === 'string' ? filterValue : (filterValue as FilterValue).value) : stateValue) as string}
        onChange={(e) => changeCallback(e, (e.target as HTMLInputElement).value)}
        onKeyDown={(e) =>
          e.key === 'Enter' && onSubmit?.(e, ((typeof value === 'string' ? filterValue : (filterValue as FilterValue).value) as string) || stateValue)
        }
        ouiaId="ConditionalFilter"
        placeholder={placeholder}
        widget-type="InsightsInput"
        ref={innerRef}
      />
      <Icon size="sm">
        <InternalIcon className="ins-c-search-icon" />
      </Icon>
    </Fragment>
  );
};

export default TextFilter;
