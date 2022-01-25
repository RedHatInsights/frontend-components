import { useState, useEffect } from 'react';
import { getRBAC, doesHavePermissions } from '../RBAC';

export function usePermissions(appName, permissionsList) {
  const [permissions, setPermissions] = useState({ isLoading: true });
  useEffect(() => {
    setPermissions({ isLoading: true });
    (async () => {
      const { isOrgAdmin, permissions: userPermissions } = await getRBAC(appName);
      setPermissions({
        isLoading: false,
        isOrgAdmin,
        permissions: userPermissions,
        hasAccess: doesHavePermissions(userPermissions, permissionsList),
      });
    })();
  }, [appName]);
  return permissions;
}

export default usePermissions;
