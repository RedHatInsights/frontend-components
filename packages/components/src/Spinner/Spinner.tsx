import { useIntlWithFallback } from '@redhat-cloud-services/frontend-components-translations/localization';
import React from 'react';
import classNames from 'classnames';

import './spinner.scss';
import messages from '../messages';

export interface SpinnerProps {
  centered?: boolean;
  className?: string;
  /** Localized status text for screen readers. */
  loadingText?: string;
}

const Spinner = ({ centered, className, loadingText: loadingTextProp, ...props }: SpinnerProps) => {
  const intl = useIntlWithFallback();
  const loadingText = loadingTextProp === undefined ? intl.formatMessage(messages.spinnerLoadingText) : loadingTextProp;

  const spinnerClasses = classNames('ins-c-spinner', { [`ins-m-center`]: centered }, className);

  return (
    <div role="status" className={spinnerClasses} {...props}>
      <span className="pf-v6-u-screen-reader">{loadingText}</span>
    </div>
  );
};

export default Spinner;
