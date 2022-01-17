import React from 'react';
import PropTypes from 'prop-types';
import { ScalprumComponent } from '@scalprum/react-core';
import { Bullseye, Spinner } from '@patternfly/react-core';
import classNames from 'classnames';

const BaseAsyncComponent = ({ appName, scope, module, fallback, innerRef, className, component: Cmp, ...props }) => {
  return (
    <Cmp className={classNames(className, appName)}>
      <ScalprumComponent
        className={className}
        appName={appName}
        module={module}
        scope={scope || appName}
        ErrorComponent={fallback}
        ref={innerRef}
        fallback={fallback}
        {...props}
      />
    </Cmp>
  );
};

/**
 * Async component that wraps ScalprumComponent for easier manipulation.
 *
 * This component uses fallback as ErrorComponent, if you want to show different
 * component for error pass it as ErrorComponent prop.
 */
const AsynComponent = React.forwardRef((props, ref) => <BaseAsyncComponent innerRef={ref} {...props} />);

AsynComponent.propTypes = {
  /** React Suspense fallback component. <a href="https://reactjs.org/docs/code-splitting.html#reactlazy" target="_blank">Learn more</a>. */
  fallback: PropTypes.node,
  /** Name of the app from which module will be loaded. */
  appName: PropTypes.string.isRequired,
  /** Loaded module, it has to start with `./`. */
  module: PropTypes.string.isRequired,
  /** Optional scope, if not passed appName is used. */
  scope: PropTypes.string,
  /** Optional wrapper component */
  component: PropTypes.string,
};

AsynComponent.defaultProps = {
  fallback: (
    <Bullseye>
      <Spinner size="xl" />
    </Bullseye>
  ),
  component: 'section',
};

BaseAsyncComponent.propTypes = {
  ...AsynComponent.propTypes,
  innerRef: PropTypes.any,
};

export default AsynComponent;
