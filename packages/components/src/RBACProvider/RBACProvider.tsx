import React, { useEffect, useState } from 'react';
import { Bullseye } from '@patternfly/react-core/dist/dynamic/layouts/Bullseye';
import { Spinner } from '@patternfly/react-core/dist/dynamic/components/Spinner';
import { Access } from '@redhat-cloud-services/rbac-client/types';

/* eslint-disable @redhat-cloud-services/disallow-fec-relative-imports */
import {
  RBACContext,
  doesHavePermissions,
  getRBAC,
  hasAllPermissions,
  initialPermissions,
} from '@redhat-cloud-services/frontend-components-utilities';
/* eslint-enable @redhat-cloud-services/disallow-fec-relative-imports */

const hasAccessWithUserPermissions = (userPermissions: (Access | string)[], checkResourceDefinitions: boolean) => {
  return (requiredPermissions: (Access | string)[], checkAll?: boolean, checkResourceDefinitionsOverride?: boolean): boolean => {
    return checkAll
      ? hasAllPermissions(userPermissions, requiredPermissions, checkResourceDefinitionsOverride ?? checkResourceDefinitions)
      : doesHavePermissions(userPermissions, requiredPermissions, checkResourceDefinitionsOverride ?? checkResourceDefinitions);
  };
};

export interface RBACProviderProps {
  appName?: string | null;
  checkResourceDefinitions?: boolean;
}

export const RBACProvider: React.FunctionComponent<React.PropsWithChildren<RBACProviderProps>> = ({
  appName,
  checkResourceDefinitions = false,
  children,
}) => {
  const [permissionState, setPermissionState] = useState(initialPermissions);

  const fetchPermissions = async () => {
    const { isOrgAdmin, permissions: userPermissions } = await getRBAC(appName === null ? '' : appName, true);

    setPermissionState((currentPerms) => ({
      ...currentPerms,
      isLoading: false,
      isOrgAdmin,
      permissions: userPermissions,
    }));
  };

  useEffect(() => {
    // if null or string - then fetch the permissions
    if (appName !== undefined) {
      fetchPermissions();
    } else {
      setPermissionState((currentPerms) => ({
        ...currentPerms,
        isLoading: false,
      }));
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
