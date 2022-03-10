import { Access } from '@redhat-cloud-services/rbac-client';
import { ChromeAPI } from '@redhat-cloud-services/types';

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

export function doesHavePermissions(userPermissions: (Access | string)[], permissionList: string[]): boolean {
  if (!userPermissions) {
    return false;
  }

  return userPermissions.some((access) => {
    return permissionList.includes(isAccessType(access) ? access?.permission : access);
  });
}

export default getRBAC;
