import React from 'react';
import classnames from 'classnames';
import { useOUIAId } from '@patternfly/react-core/';

export interface InputProps extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'capture'> {
  type?: string;
  className?: string;
  ariaLabel?: string;
  ouiaId?: string;
  ouiaSafe?: boolean;
  'data-ouia-component-type': string;
  'data-ouia-component-id': string;
  'data-ouia-safe': boolean;
}

const checkTypes = ['checkbox', 'radio'];

const Input: React.FC<InputProps> = ({ type = 'text', ariaLabel = type, className, ouiaId, ouiaSafe = true, ...props }) => {
  const classes = checkTypes.indexOf(type) !== -1 ? 'pf-c-check' : 'pf-c-form-control';
  const ouiaComponentType = 'RHI/Input';
  const ouiaFinalId = useOUIAId(ouiaComponentType, ouiaId, ouiaSafe as unknown as string);
  return (
    <input
      {...props}
      data-ouia-component-type={ouiaComponentType}
      data-ouia-component-id={ouiaFinalId}
      data-ouia-safe={ouiaSafe}
      type={type}
      aria-label={ariaLabel}
      className={classnames(classes, className)}
    />
  );
};

export default Input;
