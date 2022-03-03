import { RBAC } from '../RBAC';

export interface UsePermissionsState extends RBAC {
  hasAccess: boolean;
}

export function usePermissions(appName: string, permissionsList: string[], disableCache?: boolean): UsePermissionsState;
