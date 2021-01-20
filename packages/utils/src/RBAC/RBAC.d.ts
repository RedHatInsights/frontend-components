import { Access } from '@redhat-cloud-services/rbac-client';

export interface RBAC {
  isOrgAdmin: boolean;
  permissions: Access[];
}

export function getRBAC(applicationName: string): Promise<RBAC>;
export function doesHavePermissions(RBACResults: RBAC, permissionList: string[]): boolean;
