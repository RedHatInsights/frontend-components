import React from 'react';
import classnames from 'classnames';
import Input, { InputProps } from './Input';

const LabeledInput: React.FC<React.PropsWithChildren<InputProps>> = ({ type = 'text', className, children, name, ...props }) => {
  // Might generate ID which is not unique enough
  name = name || new Date().getTime() + Math.random().toString(36);
  return (
    <label className={classnames('pf-c-form__label', className)} htmlFor={name}>
      <Input {...props} type={type} name={name} id={name} /> {children}
    </label>
  );
};

export default LabeledInput;
