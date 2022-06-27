import { doesHavePermissions, getRBAC, hasAllPermissions } from './RBAC';

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
  describe('has all permissions', () => {
    const requiredPermissions = ['cost-management:rate:write', 'some-app:*:*'];
    it('returns false permissions is null or undefined', () => {
      expect(hasAllPermissions(null, requiredPermissions)).toBe(false);
      expect(hasAllPermissions(undefined, requiredPermissions)).toBe(false);
    });
    it('returns false if permissions do not exist', () => {
      expect(hasAllPermissions([], requiredPermissions)).toBe(false);
      expect(hasAllPermissions(['cost-management:rate:read', 'cost-management:cluster:write'], requiredPermissions)).toBe(false);
    });
    it('returns true for all permissions', () => {
      expect(hasAllPermissions(['cost-management:rate:write', 'some-app:*:*'], requiredPermissions)).toBe(true);
    });
    it('return true for permission object', () => {
      expect(doesHavePermissions([{ permission: 'cost-management:rate:write' }, { permission: 'some-app:*:*' }], requiredPermissions)).toBe(true);
    });
    it('returns true for star permissions', () => {
      expect(
        hasAllPermissions(['cost-management:rate:*', 'cost-management:*:write', '*:*:*', '*:*:write', 'some-app:*:*'], requiredPermissions)
      ).toBe(true);
    });
    it('returns false for missing permissions', () => {
      expect(hasAllPermissions(['cost-management:*:read', 'some-app:*:*'], requiredPermissions)).toBe(false);
    });
  });
  describe('ger RBAC', () => {
    it('returns permission list and is org admin', async () => {
      const resp = await getRBAC('app-name');
      expect(resp).toEqual({ isOrgAdmin: true, permissions: [] });
    });
  });
});
