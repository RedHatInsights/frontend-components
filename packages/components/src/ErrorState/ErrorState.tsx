import React from 'react';
import ErrorStatePF, { ErrorStateProps } from '@patternfly/react-component-groups/dist/dynamic/ErrorState';
import DefaultErrorMessage from './DefaultErrorMessage';

/**
 * @deprecated Do not use deprecated ErrorState import, the component has been moved to @patternfly/react-component-groups
 */
const ErrorState = (props: ErrorStateProps) => <ErrorStatePF defaultBodyText={<DefaultErrorMessage />} {...props} />;

export default ErrorState;
