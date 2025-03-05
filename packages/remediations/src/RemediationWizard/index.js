import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { ScalprumComponent } from '@scalprum/react-core';
import { Bullseye, Spinner } from '@patternfly/react-core';
import RemediationLoadError from '../common/RemediationLoadError';

const BaseRemediationWizard = (props) => {
  return (
    <Suspense fallback={props.fallback}>
      <ScalprumComponent
        appName="remediations"
        module="./RemediationWizard"
        scope="remediations"
        ErrorComponent={<RemediationLoadError component="RemediationWizard" {...props} />}
        ref={props.innerRef}
        {...props}
      />
    </Suspense>
  );
};

BaseRemediationWizard.propTypes = {
  fallback: PropTypes.node,
  innerRef: PropTypes.object,
};

/**
 * Remediations sub component.
 *
 * This component shows remediations button with wizard.
 */
const RemediationWizard = React.forwardRef((props, ref) => <BaseRemediationWizard innerRef={ref} {...props} />);

RemediationWizard.propTypes = {
  /** React Suspense fallback component. <a href="https://reactjs.org/docs/code-splitting.html#reactlazy" target="_blank">Learn more</a>. */
  fallback: PropTypes.node,
};

RemediationWizard.defaultProps = {
  fallback: (
    <Bullseye className="pf-v6-u-p-lg">
      <Spinner size="xl" />
    </Bullseye>
  ),
};

export default RemediationWizard;
