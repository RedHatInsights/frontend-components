import React, { useEffect, useRef, useState } from 'react';
import { Access } from '@redhat-cloud-services/rbac-client';
import { Bullseye, Spinner } from '@patternfly/react-core';

import {
  RBACContext,
  doesHavePermissions,
  getRBAC,
  hasAllPermissions,
  initialPermissions,
} from '@redhat-cloud-services/frontend-components-utilities/RBAC';

const hasAccessWithUserPermissions = (userPermissions: (Access | string)[]) => {
  return (requiredPermissions: string[], checkAll = true): boolean => {
    return checkAll ? hasAllPermissions(userPermissions, requiredPermissions) : doesHavePermissions(userPermissions, requiredPermissions);
  };
};

export interface RBACProviderProps {
  appName: string;
}

export const RBACProvider: React.FunctionComponent<RBACProviderProps> = ({ appName, children }) => {
  const loading = useRef(false);
  const [permissionState, setPermissionState] = useState(initialPermissions);

  const fetchPermissions = async () => {
    loading.current = true;
    const { isOrgAdmin, permissions: userPermissions } = await getRBAC(appName, true);

    setPermissionState((currentPerms: any) => ({
      ...currentPerms,
      isLoading: false,
      isOrgAdmin,
      permissions: userPermissions,
    }));
    loading.current = false;
  };

  useEffect(() => {
    if (!loading.current && permissionState.permissions.length == 0) {
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
