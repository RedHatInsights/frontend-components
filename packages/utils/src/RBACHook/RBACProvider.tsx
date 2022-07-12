import React, { useEffect, useState } from 'react';
import { Access } from '@redhat-cloud-services/rbac-client';
import { doesHavePermissions, getRBAC, hasAllPermissions } from '../RBAC';
import { RBACContext, initialPermissions } from './constants';

const hasAccessWithUserPermissions = (userPermissions: Access[]) => {
  return (requiredPermissions: any, checkAll = true) => {
    return checkAll ? hasAllPermissions(userPermissions, requiredPermissions) : doesHavePermissions(userPermissions, requiredPermissions);
  };
};

export interface RBACProviderProps {
  appName: string;
}

const RBACProvider: React.FunctionComponent<RBACProviderProps> = ({ appName, children }) => {
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
    console.log('SADASD', appName, permissionState, loading);
    if (!loading && permissionState.permissions.length == 0) {
      fetchPermissions();
    }
  }, [appName]);

  return (
    <RBACContext.Provider
      value={{
        ...permissionState,
        hasAccess: hasAccessWithUserPermissions(permissionState?.permissions),
      }}
    >
      {!permissionState.isLoading && children}
    </RBACContext.Provider>
  );
};

export default RBACProvider;
