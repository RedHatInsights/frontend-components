import React from 'react';
import { ErrorBoundary as ErrorBoundaryPF } from '@patternfly/react-component-groups';
import { DefaultErrorMessage } from '../ErrorState';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ErrorBoundary: React.FunctionComponent<any> = (props) => {
  console.error(
    'Importing <ErrorBoundary/> from @redhat-cloud-services/frontend-components is deprecated! Use it from @patternfly/react-component-groups instead.'
  );
  return <ErrorBoundaryPF defaultErrorDescription={DefaultErrorMessage} {...props} />;
};

export default ErrorBoundary;
