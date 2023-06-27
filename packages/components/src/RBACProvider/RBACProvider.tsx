import React, { useEffect, useState } from 'react';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { Access } from '@redhat-cloud-services/rbac-client';

import {
  RBACContext,
  doesHavePermissions,
  getRBAC,
  hasAllPermissions,
  initialPermissions,
} from '@redhat-cloud-services/frontend-components-utilities/RBAC';

const hasAccessWithUserPermissions = (userPermissions: (Access | string)[], checkResourceDefinitions: boolean) => {
  return (requiredPermissions: (Access | string)[], checkAll?: boolean): boolean => {
    return checkAll
      ? hasAllPermissions(userPermissions, requiredPermissions, checkResourceDefinitions)
      : doesHavePermissions(userPermissions, requiredPermissions, checkResourceDefinitions);
  };
};

export interface RBACProviderProps {
  appName: string;
  checkResourceDefinitions: boolean;
}

export const RBACProvider: React.FunctionComponent<RBACProviderProps> = ({ appName, checkResourceDefinitions = false, children }) => {
  const [permissionState, setPermissionState] = useState(initialPermissions);

  const fetchPermissions = async () => {
    const { isOrgAdmin, permissions: userPermissions } = await getRBAC(appName, true);

    setPermissionState((currentPerms) => ({
      ...currentPerms,
      isLoading: false,
      isOrgAdmin,
      permissions: userPermissions,
    }));
  };

  useEffect(() => {
    if (appName) {
      fetchPermissions();
    }
  }, [appName]);

  return (
    <RBACContext.Provider
      value={{
        ...permissionState,
        hasAccess: hasAccessWithUserPermissions(permissionState?.permissions || [], checkResourceDefinitions),
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
