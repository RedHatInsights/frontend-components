import React from 'react';
import ErrorBoundaryPF, { ErrorPageProps } from '@patternfly/react-component-groups/dist/dynamic/ErrorBoundary';
import { DefaultErrorMessage } from '../ErrorState';

/**
 * @deprecated Do not use deprecated ErrorBoundary import, the component has been moved to @patternfly/react-component-groups
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ErrorBoundary: React.FunctionComponent<ErrorPageProps> = (props) => (
  <ErrorBoundaryPF defaultErrorDescription={<DefaultErrorMessage />} {...props} />
);

export default ErrorBoundary;
