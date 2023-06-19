import React from 'react';
import { ErrorState as ErrorStatePF } from '@patternfly/react-component-groups';
import DefaultErrorMessage from './DefaultErrorMessage';

const ErrorState: React.FunctionComponent = (props) => {
  console.error(
    'Importing <ErrorState/> from @redhat-cloud-services/frontend-components is deprecated! Use it from @patternfly/react-component-groups instead.'
  );
  return <ErrorStatePF defaultErrorDescription={DefaultErrorMessage} {...props} />;
};

export default ErrorState;
