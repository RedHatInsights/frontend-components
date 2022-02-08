import React, { useState, Fragment } from 'react';
import { TextInput } from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import './conditional-filter.scss';

interface TextProps {
  /** Optional text filter value. */
  value?: string;
  /** Optional text filter placeholder. */
  placeholder?: string;
  /** Optional onChange event called on input change. */
  onChange?: (e: object, value: string) => void;
  /** Optional onSubmit event called on Enter press. */
  onSubmit?: (e: object, value: string) => void;
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
}

/**
 * Component that works as a text filter for ConditionalFilter component.
 *
 * This component accepts onChange event called on input change
 * and onSubmit event called on Enter press.
 */
const Text: React.FunctionComponent<TextProps> = ({ value, onChange, onSubmit, id, icon, className, isDisabled, ...props }) => {
  const [stateValue, setStateValue] = useState('');
  const Icon = icon || SearchIcon;
  const changeCallback = (e: object, value: string) => (onChange ? onChange(e, value) : setStateValue(value));

  return (
    <Fragment>
      <TextInput
        {...props}
        className={`ins-c-conditional-filter ${className || ''}`}
        id={id}
        isDisabled={isDisabled}
        value={onChange ? value : stateValue}
        onChange={(_inputValue, e) => changeCallback(e, (e.target as HTMLInputElement).value)}
        widget-type="InsightsInput"
        onKeyDown={(e) => e.key === 'Enter' && onSubmit && onSubmit(e, value || stateValue)}
        data-ouia-component-type="PF4/TextInput"
        ouiaId="ConditionalFilter"
      />
      <Icon size="sm" className="ins-c-search-icon" />
    </Fragment>
  );
};

Text.defaultProps = {
  value: '',
  onSubmit: () => undefined,
  isDisabled: false,
  'aria-label': 'text input',
};

export default Text;
