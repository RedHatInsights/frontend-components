import { useEffect, useState } from 'react';
import { RBAC, doesHavePermissions, getRBAC, hasAllPermissions } from '../RBAC';

export interface UsePermissionsState extends RBAC {
  hasAccess: boolean;
  isLoading: boolean;
}

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

export default usePermissions;
