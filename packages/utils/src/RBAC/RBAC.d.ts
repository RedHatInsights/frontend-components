import { Access } from '@redhat-cloud-services/rbac-client';

export interface RBAC {
  isOrgAdmin: boolean;
  permissions: Access[];
}

export function getRBAC(applicationName: string, disableCache?: boolean): Promise<RBAC>;
export function doesHavePermissions(RBACResults: RBAC, permissionList: string[]): boolean;
