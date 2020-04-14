import { RBAC } from './RBAC';

export interface UsePermissionsState extends RBAC {
    hasAccess: boolean;
}

declare function usePermissions(appName: string, permissionsList: string[]): UsePermissionsState
