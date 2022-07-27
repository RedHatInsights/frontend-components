import React, { useEffect, useState } from 'react';
import { Access } from '@redhat-cloud-services/rbac-client';
import { Bullseye, Spinner } from '@patternfly/react-core';

import {
  RBACContext,
  doesHavePermissions,
  getRBAC,
  hasAllPermissions,
  initialPermissions,
} from '@redhat-cloud-services/frontend-components-utilities/RBAC';

const hasAccessWithUserPermissions = (userPermissions: Access[]) => {
  return (requiredPermissions: any, checkAll = true) => {
    return checkAll ? hasAllPermissions(userPermissions, requiredPermissions) : doesHavePermissions(userPermissions, requiredPermissions);
  };
};

export interface RBACProviderProps {
  appName: string;
}

export const RBACProvider: React.FunctionComponent<RBACProviderProps> = ({ appName, children }) => {
  const [permissionState, setPermissionState] = useState(initialPermissions);
  let loading = false;

  const fetchPermissions = async () => {
    loading = true;
    const { isOrgAdmin, permissions: userPermissions } = await getRBAC(appName, true);

    setPermissionState((currentPerms: any) => ({
      ...currentPerms,
      isLoading: false,
      isOrgAdmin,
      permissions: userPermissions,
    }));
    loading = false;
  };

  useEffect(() => {
    if (!loading && permissionState.permissions.length == 0) {
      fetchPermissions();
    }
  }, [appName]);

  return (
    <RBACContext.Provider
      value={{
        ...permissionState,
        hasAccess: hasAccessWithUserPermissions(permissionState?.permissions || []),
      }}
    >
      {!permissionState.isLoading ? (
        children
      ) : (
        <Bullseye>
          <Spinner size="xl" />
        </Bullseye>
      )}
    </RBACContext.Provider>
  );
};
