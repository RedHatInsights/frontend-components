import { getRBAC, doesHavePermissions } from './RBAC';

describe('RBAC utilities', () => {
  describe('does have permissions', () => {
    const requiredPermissions = ['cost-management:rate:write', 'cost-management:*:*'];
    it('returns false permissions is null or undefined', () => {
      expect(doesHavePermissions(null, requiredPermissions)).toBe(false);
      expect(doesHavePermissions(undefined, requiredPermissions)).toBe(false);
    });
    it('returns false if permissions do not exist', () => {
      expect(doesHavePermissions([], requiredPermissions)).toBe(false);
      expect(doesHavePermissions(['cost-management:rate:read', 'cost-management:cluster:write'], requiredPermissions)).toBe(false);
    });
    it('returns true and at least one required permissions exists', () => {
      expect(doesHavePermissions(['cost-management:rate:write', 'cost-management:cluster:write'], requiredPermissions)).toBe(true);
    });
    it('return true for permission object', () => {
      expect(doesHavePermissions([{ permission: 'cost-management:rate:write' }, 'cost-management:cluster:write'], requiredPermissions)).toBe(true);
    });
  });
  describe('ger RBAC', () => {
    it('returns permission list and is org admin', async () => {
      const resp = await getRBAC('app-name');
      expect(resp).toEqual({ isOrgAdmin: true, permissions: [] });
    });
  });
});
