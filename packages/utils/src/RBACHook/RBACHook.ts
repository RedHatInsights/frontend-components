import { useContext, useEffect, useState } from 'react';
import { RBACContext, UsePermissionsState, doesHavePermissions, getRBAC, hasAllPermissions } from '../RBAC';

export function usePermissions(appName: string, permissionsList: string[], disableCache?: boolean, checkAll?: boolean): UsePermissionsState {
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
          hasAccess: checkAll ? hasAllPermissions(userPermissions, permissionsList) : doesHavePermissions(userPermissions, permissionsList),
        });
    })();

    return () => {
      ignore = true;
    };
  }, [appName, disableCache]);

  return permissions;
}

export const usePermissionsWithContext = (requiredPermissions: string[]) => {
  const { hasAccess, ...permissionState } = useContext(RBACContext);

  return {
    ...permissionState,
    hasAccess: hasAccess?.(requiredPermissions) || false,
  };
};

export default usePermissions;
