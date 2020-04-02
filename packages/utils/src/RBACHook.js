import { useState, useEffect } from 'react';
import { getRBAC, doesHavePermissions } from './RBAC';

export function usePermissions(appName, permissionsList) {
    const [ permissions, setPermissions ] = useState({});
    useEffect(() => {
        (async () => {
            const { isOrgAdmin, permissions: userPermissions } = await getRBAC(appName);
            setPermissions({
                isOrgAdmin,
                permissions: userPermissions,
                hasAccess: doesHavePermissions(userPermissions, permissionsList)
            });
        })();
    }, [ appName ]);
    return permissions;
}
