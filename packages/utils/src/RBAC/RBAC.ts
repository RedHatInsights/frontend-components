import { createContext } from 'react';
import { Access, ResourceDefinition, ResourceDefinitionFilterOperationEnum } from '@redhat-cloud-services/rbac-client';
import type { ChromeAPI } from '@redhat-cloud-services/types';

declare global {
  interface Window {
    insights: {
      chrome: ChromeAPI;
    };
  }
}

export interface RBAC {
  isOrgAdmin: boolean;
  permissions: Access[];
}

export async function getRBAC(applicationName = '', disableCache = false): Promise<RBAC> {
  const insights = window.insights;
  const user = await insights?.chrome?.auth?.getUser();
  return {
    // eslint-disable-next-line camelcase
    isOrgAdmin: user?.identity?.user?.is_org_admin || false,
    permissions: (await insights?.chrome?.getUserPermissions(applicationName, disableCache)) || null,
  };
}

function isAccessType(permission: Access | string): permission is Access {
  return typeof permission === 'object';
}

function extractResourceDefinitionValues(rds: ResourceDefinition[]) {
  return rds.reduce((acc, cur) => {
    const { scope, operation, value } = cur.attributeFilter;

    if (operation === ResourceDefinitionFilterOperationEnum.In) {
      return [...acc, ...value.split(',').map((value) => `${scope}:${value}`)];
    }

    if (operation === ResourceDefinitionFilterOperationEnum.Equal) {
      return [...acc, `${scope}:${value}`];
    }

    throw new TypeError('Resource definition operation has incorrect format.');
  }, []);
}

function verifyResourceDefinitions(userRds: ResourceDefinition[], requestedRds: ResourceDefinition[]) {
  const userValues = extractResourceDefinitionValues(userRds),
    requestedValues = extractResourceDefinitionValues(requestedRds);

  return requestedValues.every((value) => userValues.includes(value));
}

function checkRequestedPermission(
  userPermissions: (Access | string)[],
  requestedPermission: Access | string,
  checkResourceDefinitions: boolean
): boolean {
  return userPermissions.some((userPermission: Access | string) => {
    const requestedPermissionArray = (isAccessType(requestedPermission) ? requestedPermission.permission : requestedPermission).split(':');
    const userPermissionArray = (isAccessType(userPermission) ? userPermission.permission : userPermission).split(':');

    let wildcard = false;

    const matchesPermission = userPermissionArray.slice(0).reduce((acc, curr, index, array) => {
      if (acc === false) {
        array.splice(index);
        return acc;
      }

      if (curr === '*') {
        wildcard = true;
        return true;
      }

      if (curr === requestedPermissionArray?.[index]) {
        wildcard = false;
        return true;
      }

      return false;
    }, true);

    if (checkResourceDefinitions === true) {
      if (matchesPermission === true) {
        if (wildcard === true) {
          return true; // user permission contains wildcard = ignore resource definition check
        }

        if (isAccessType(userPermission)) {
          if (userPermission.resourceDefinitions === undefined || userPermission.resourceDefinitions.length === 0) {
            return true; // user permission is not limited with resource definition = has general permission
          }

          if (
            !isAccessType(requestedPermission) ||
            userPermission.resourceDefinitions === undefined ||
            requestedPermission.resourceDefinitions.length === 0
          ) {
            return false;
          }

          return verifyResourceDefinitions(userPermission.resourceDefinitions, requestedPermission.resourceDefinitions);
        }

        return true; // user permission is not limited with resource definition = has general permission
      }
    }

    return matchesPermission;
  });
}

// when checkAll is false
export function doesHavePermissions(
  userPermissions: (Access | string)[],
  permissionList: (Access | string)[],
  checkResourceDefinitions: boolean
): boolean {
  if (!userPermissions) {
    return false;
  }

  return permissionList.some((permission) => checkRequestedPermission(userPermissions, permission, checkResourceDefinitions));
}

// when checkAll is true
export function hasAllPermissions(
  userPermissions: (Access | string)[],
  permissionList: (Access | string)[],
  checkResourceDefinitions: boolean
): boolean {
  if (!userPermissions) {
    return false;
  }

  return permissionList.every((permission) => checkRequestedPermission(userPermissions, permission, checkResourceDefinitions));
}

export interface UsePermissionsState extends RBAC {
  isLoading: boolean;
  hasAccess?: boolean;
}

export interface UsePermissionsContextState {
  isLoading?: boolean;
  isOrgAdmin: boolean;
  permissions: (string | Access)[];
  hasAccess?: (requiredPermissions: string[], checkAll?: boolean) => boolean;
}

export const initialPermissions: UsePermissionsContextState = {
  isLoading: true,
  isOrgAdmin: false,
  permissions: [],
};

export const RBACContext = createContext(initialPermissions);

export default getRBAC;
