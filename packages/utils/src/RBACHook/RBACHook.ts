import { useContext, useEffect, useState } from 'react';
import { RBACContext, UsePermissionsState, doesHavePermissions, getRBAC, hasAllPermissions } from '../RBAC';
import { Access } from '@redhat-cloud-services/rbac-client';

export function usePermissions(
  appName: string,
  permissionsList: (Access | string)[],
  disableCache?: boolean,
  checkAll?: boolean,
  checkResourceDefinitions = false
): UsePermissionsState {
  const [permissions, setPermissions] = useState<UsePermissionsState>({
    isLoading: true,
    hasAccess: false,
    isOrgAdmin: false,
    permissions: [],
  });
  useEffect(() => {
    let ignore = false;
    setPermissions((prev) => ({ ...prev, isLoading: true }));
    (async () => {
      const { isOrgAdmin, permissions: userPermissions } = await getRBAC(appName, disableCache);
      !ignore &&
        setPermissions({
          isLoading: false,
          isOrgAdmin,
          permissions: userPermissions,
          hasAccess: checkAll
            ? hasAllPermissions(userPermissions, permissionsList, checkResourceDefinitions)
            : doesHavePermissions(userPermissions, permissionsList, checkResourceDefinitions),
        });
    })();

    return () => {
      ignore = true;
    };
  }, [appName, disableCache]);

  return permissions;
}

export const usePermissionsWithContext = (requiredPermissions: (Access | string)[], checkAll?: boolean) => {
  const { hasAccess, ...permissionState } = useContext(RBACContext);

  return {
    ...permissionState,
    hasAccess: hasAccess?.(requiredPermissions, checkAll) || false,
  };
};

export default usePermissions;
