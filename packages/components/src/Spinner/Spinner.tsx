import React from 'react';
import classNames from 'classnames';

import './spinner.scss';

export interface SpinnerProps {
  centered?: boolean;
  className?: string;
}

const Spinner: React.FunctionComponent<SpinnerProps> = ({ centered, className, ...props }) => {
  const spinnerClasses = classNames('ins-c-spinner', { [`ins-m-center`]: centered }, className);

  return (
    <div role="status" className={spinnerClasses} {...props}>
      <span className="pf-v6-u-screen-reader">Loading...</span>
    </div>
  );
};

export default Spinner;
