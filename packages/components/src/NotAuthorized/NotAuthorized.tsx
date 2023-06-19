import React from 'react';
import { NotAuthorized as NotAuthorizedPF } from '@patternfly/react-component-groups';

const NotAuthorized: React.FunctionComponent = (props) => {
  console.error(
    'Importing <NotAuthorized/> from @redhat-cloud-services/frontend-components is deprecated! Use it from @patternfly/react-component-groups instead.'
  );
  return (
    <NotAuthorizedPF
      description={
        <>
          Contact your organization administrator(s) for more information or visit&nbsp;<a href={`./iam/my-user-access`}>My User Access</a>&nbsp;to
          learn more about your permissions.
        </>
      }
      {...props}
    />
  );
};

export default NotAuthorized;
