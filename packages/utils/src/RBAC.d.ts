import { Access } from '@redhat-cloud-services/rbac-client';

export interface RBAC {
  isOrgAdmin: boolean;
  permissions: Access[];
}

declare function getRBAC(applicationName: string): Promise<RBAC>;
declare function doesHavePermissions(RBACResults: RBAC, permissionList: string[]): boolean;
