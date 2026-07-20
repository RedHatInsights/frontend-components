import React, { Suspense } from 'react';
import { ScalprumComponent } from '@scalprum/react-core';
import { Bullseye, Spinner } from '@patternfly/react-core';
import RemediationLoadError from '../common/RemediationLoadError';

interface BaseRemediationWizardProps extends Record<string, unknown> {
  fallback?: React.ReactNode;
  innerRef?: React.Ref<unknown>;
}

export interface RemediationWizardProps extends Record<string, unknown> {
  /** React Suspense fallback component. */
  fallback?: React.ReactNode;
}

const BaseRemediationWizard = ({
  fallback = (
    <Bullseye className="pf-v6-u-p-lg">
      <Spinner size="xl" />
    </Bullseye>
  ),
  innerRef,
  ...props
}: BaseRemediationWizardProps) => {
  return (
    <Suspense fallback={fallback}>
      <ScalprumComponent
        appName="remediations"
        module="./RemediationWizard"
        scope="remediations"
        ErrorComponent={<RemediationLoadError component="RemediationWizard" {...props} />}
        ref={innerRef}
        {...props}
      />
    </Suspense>
  );
};

/**
 * Remediations sub component.
 *
 * This component shows remediations button with wizard.
 */
const RemediationWizard = React.forwardRef<unknown, RemediationWizardProps>((props, ref) => <BaseRemediationWizard innerRef={ref} {...props} />);

RemediationWizard.displayName = 'RemediationWizard';

export default RemediationWizard;
