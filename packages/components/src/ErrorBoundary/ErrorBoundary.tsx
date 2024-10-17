import React from 'react';
import ErrorBoundaryPF, { ErrorBoundaryProps } from '@patternfly/react-component-groups/dist/dynamic/ErrorBoundary';
import { DefaultErrorMessage } from '../ErrorState';

/**
 * @deprecated Do not use deprecated ErrorBoundary import, the component has been moved to @patternfly/react-component-groups
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ErrorBoundary: React.FunctionComponent<ErrorBoundaryProps> = (props) => (
  <ErrorBoundaryPF defaultErrorDescription={<DefaultErrorMessage />} {...props} />
);

export default ErrorBoundary;
