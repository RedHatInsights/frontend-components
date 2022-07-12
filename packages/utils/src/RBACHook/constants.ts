import { createContext } from 'react';
import { RBAC } from '../RBAC';

export const initialPermissions = {
  isLoading: true,
  loaded: false,
  isOrgAdmin: false,
  permissions: [],
  hasAccess: (_?: any) => {
    return;
  },
};

export const RBACContext = createContext(initialPermissions);

export interface UsePermissionsState extends RBAC {
  isLoading: boolean;
  hasAccess?: boolean;
}
