import React, { FormEvent, Fragment, MouseEventHandler, ReactNode } from 'react';
import { Icon } from '@patternfly/react-core/dist/dynamic/components/Icon';
import { TextInput } from '@patternfly/react-core/dist/dynamic/components/TextInput';
import { TextInputProps } from '@patternfly/react-core/dist/dynamic/components/TextInput';
import SearchIcon from '@patternfly/react-icons/dist/dynamic/icons/search-icon';
import './conditional-filter.scss';
import classNames from 'classnames';

export function isFilterValue(item: undefined | string | number | boolean | FilterValue | Record<string, any>): item is FilterValue {
  return item !== null && typeof item === 'object';
}
export interface FilterItem {
  /** Item label. */
  label: ReactNode;
  /** Optional item name. */
  name?: string;
  /** Item value. */
  value: string;
  /** Item identifier. */
  id?: string;
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
  /** Filter value. */
  value: string | number | boolean;
}

export interface TextFilterProps extends Omit<TextInputProps, 'onChange'> {
  onChange: NonNullable<TextInputProps['onChange']>;
}

/**
 * Component that works as a text filter for ConditionalFilter component.
 *
 * This component accepts onChange event called on input change
 * and onSubmit event called on Enter press.
 *
 * It was not designed to be used as a standalone component, but rather within conditionalFilter.
 */
const TextFilter: React.FunctionComponent<TextFilterProps> = ({ customIcon = <SearchIcon />, isDisabled = false, className, innerRef, ...props }) => {
  return (
    <Fragment>
      <TextInput
        {...props}
        customIcon={
          <Icon className="ins-c-search-icon" size="md">
            {customIcon}
          </Icon>
        }
        isDisabled={isDisabled}
        aria-label={props['aria-label'] || 'text input'}
        className={classNames('ins-c-conditional-filter', className)}
        data-ouia-component-type="PF4/TextInput"
        onKeyDown={(e) => e.key === 'Enter' && props?.onSubmit?.(e)}
        ouiaId="ConditionalFilter"
        widget-type="InsightsInput"
        ref={innerRef}
      />
    </Fragment>
  );
};

export default TextFilter;
