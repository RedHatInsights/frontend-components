import React, { Suspense } from 'react';
import { ScalprumComponent, ScalprumComponentProps } from '@scalprum/react-core';
import { Bullseye, Spinner } from '@patternfly/react-core';
import RemediationLoadError from '../common/RemediationLoadError';

interface BaseRemediationButtonProps extends Record<string, unknown> {
  fallback?: React.ReactNode;
  innerRef?: React.Ref<unknown>;
}

export interface RemediationButtonProps extends Record<string, unknown> {
  /** React Suspense fallback component. */
  fallback?: React.ReactNode;
  /** Optional tooltip text when the user may remediate; shown after permission/selection checks. */
  buttonTooltipContent?: string;
}

const BaseRemediationButton = ({
  fallback = (
    <Bullseye className="pf-v6-u-p-lg">
      <Spinner size="xl" />
    </Bullseye>
  ),
  innerRef,
  ...props
}: BaseRemediationButtonProps) => {
  const SCProps: ScalprumComponentProps = {
    appName: 'remediations',
    module: './RemediationButton',
    scope: 'remediations',
    ErrorComponent: <RemediationLoadError component="RemediationButton" {...props} />,
    ref: innerRef,
    ...props,
  };
  return (
    <Suspense fallback={fallback}>
      <ScalprumComponent {...SCProps} />
    </Suspense>
  );
};

/**
 * Remediations sub component.
 *
 * This component shows remediations button with wizard.
 */
const RemediationButton = React.forwardRef<unknown, RemediationButtonProps>((props, ref) => <BaseRemediationButton innerRef={ref} {...props} />);

RemediationButton.displayName = 'RemediationButton';

export default RemediationButton;
