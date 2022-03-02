import { useState, useEffect } from 'react';
import { getRBAC, doesHavePermissions } from '../RBAC';

export function usePermissions(appName, permissionsList, disableCache) {
  const [permissions, setPermissions] = useState({ isLoading: true });
  useEffect(() => {
    setPermissions({ isLoading: true });
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
