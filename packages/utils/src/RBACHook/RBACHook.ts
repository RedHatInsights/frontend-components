import { useState, useEffect } from 'react';
import { getRBAC, doesHavePermissions, RBAC } from '../RBAC';

export interface UsePermissionsState extends RBAC {
  hasAccess: boolean;
  isLoading: boolean;
}

export function usePermissions(appName: string, permissionsList: string[], disableCache?: boolean): UsePermissionsState {
  const [permissions, setPermissions] = useState<UsePermissionsState>({
    isLoading: true,
    hasAccess: false,
    isOrgAdmin: false,
    permissions: [],
  });
  useEffect(() => {
    setPermissions((prev) => ({ ...prev, isLoading: true }));
    (async () => {
      const { isOrgAdmin, permissions: userPermissions } = await getRBAC(appName, disableCache);
      setPermissions({
        isLoading: false,
        isOrgAdmin,
        permissions: userPermissions,
        hasAccess: doesHavePermissions(userPermissions, permissionsList),
      });
    })();
  }, [appName, disableCache]);
  return permissions;
}

export default usePermissions;
