import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import Input from './Input';

const LabeledInput = ({ type = 'text', className, children, name, ...props }) => {
  // Might generate ID which is not unique enough
  name = name || new Date().getTime() + Math.random().toString(36);
  return (
    <label className={classnames('pf-c-form__label', className)} htmlFor={name}>
      <Input {...props} type={type} name={name} id={name} /> {children}
    </label>
  );
};

LabeledInput.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  name: PropTypes.string,
};

export default LabeledInput;
