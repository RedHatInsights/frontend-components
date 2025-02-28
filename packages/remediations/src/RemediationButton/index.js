import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { ScalprumComponent } from '@scalprum/react-core';
import { Bullseye, Spinner } from '@patternfly/react-core';
import RemediationLoadError from '../common/RemediationLoadError';

const BaseRemediationButton = (props) => {
  return (
    <Suspense fallback={props.fallback}>
      <ScalprumComponent
        appName="remediations"
        module="./RemediationButton"
        scope="remediations"
        ErrorComponent={<RemediationLoadError component="RemediationButton" {...props} />}
        ref={props.innerRef}
        {...props}
      />
    </Suspense>
  );
};

BaseRemediationButton.propTypes = {
  fallback: PropTypes.node,
  innerRef: PropTypes.object,
};

/**
 * Remediations sub component.
 *
 * This component shows remediations button with wizard.
 */
const RemediationButton = React.forwardRef((props, ref) => <BaseRemediationButton innerRef={ref} {...props} />);

RemediationButton.propTypes = {
  /** React Suspense fallback component. <a href="https://reactjs.org/docs/code-splitting.html#reactlazy" target="_blank">Learn more</a>. */
  fallback: PropTypes.node,
};

RemediationButton.defaultProps = {
  fallback: (
    <Bullseye className="pf-v6-u-p-lg">
      <Spinner size="xl" />
    </Bullseye>
  ),
};

export default RemediationButton;
