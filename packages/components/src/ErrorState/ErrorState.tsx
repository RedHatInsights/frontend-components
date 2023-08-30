import React from 'react';
import { ErrorState as ErrorStatePF } from '@patternfly/react-component-groups/dist/dynamic/ErrorState';
import DefaultErrorMessage from './DefaultErrorMessage';

/**
 * @deprecated Do not use deprecated ErrorState import, the component has been moved to @patternfly/react-component-groups
 */
const ErrorState: React.FunctionComponent = (props) => <ErrorStatePF defaultErrorDescription={<DefaultErrorMessage />} {...props} />;

export default ErrorState;
