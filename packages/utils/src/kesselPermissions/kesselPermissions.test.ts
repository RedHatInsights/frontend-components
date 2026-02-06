import { getKesselAccessCheckParams } from './kesselPermissions';
import type { SelfAccessCheckResourceWithRelation } from '@project-kessel/react-kessel-access-check';

const PERMISSION_MAP = {
  'app:resource:read': 'app_resource_view',
  'app:resource:write': 'app_resource_edit',
} as const;

describe('getKesselAccessCheckParams with permissionMap provided', () => {
  it('returns { resources: [] } when workspaceId is undefined', () => {
    const result = getKesselAccessCheckParams({
      permissionMap: PERMISSION_MAP,
      requiredPermissions: ['app:resource:read'],
      resourceIdOrIds: undefined,
    });
    expect(result).toEqual({ resources: [] });
  });

  it('returns { resources: [] } when requiredPermissions is empty', () => {
    const result = getKesselAccessCheckParams({
      permissionMap: PERMISSION_MAP,
      requiredPermissions: [],
      resourceIdOrIds: 'workspace-123',
    });
    expect(result).toEqual({ resources: [] });
  });

  it('returns single-resource shape when one permission is given', () => {
    const result = getKesselAccessCheckParams({
      permissionMap: PERMISSION_MAP,
      requiredPermissions: ['app:resource:read'],
      resourceIdOrIds: 'workspace-123',
    });
    expect('relation' in result).toBe(true);
    expect('resource' in result).toBe(true);
    expect(result).toEqual({
      resource: {
        id: 'workspace-123',
        type: 'workspace',
        reporter: { type: 'rbac' },
      },
      relation: 'app_resource_view',
    });
  });

  it('returns resources array shape when multiple permissions are given', () => {
    const result = getKesselAccessCheckParams({
      permissionMap: PERMISSION_MAP,
      requiredPermissions: ['app:resource:read', 'app:resource:write'],
      resourceIdOrIds: 'workspace-456',
    });
    expect('resources' in result).toBe(true);
    expect(Array.isArray((result as { resources: SelfAccessCheckResourceWithRelation[] }).resources)).toBe(true);
    expect((result as { resources: SelfAccessCheckResourceWithRelation[] }).resources).toHaveLength(2);
    expect((result as { resources: { id: string; type: string; relation: string }[] }).resources).toEqual([
      { id: 'workspace-456', type: 'workspace', relation: 'app_resource_view', reporter: { type: 'rbac' } },
      { id: 'workspace-456', type: 'workspace', relation: 'app_resource_edit', reporter: { type: 'rbac' } },
    ]);
  });

  it('skips permissions with no mapping and warns', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const result = getKesselAccessCheckParams({
      permissionMap: PERMISSION_MAP,
      requiredPermissions: ['app:resource:read', 'unknown:permission'],
      resourceIdOrIds: 'workspace-123',
    });
    expect(warnSpy).toHaveBeenCalledWith('No Kessel mapping for: unknown:permission');
    expect('relation' in result).toBe(true);
    expect((result as { resource: { id: string }; relation: string }).relation).toBe('app_resource_view');
    warnSpy.mockRestore();
  });
});

describe('getKesselAccessCheckParams without permissionMap provided', () => {
  it('returns { resources: [] } when resourceId is undefined', () => {
    const result = getKesselAccessCheckParams({
      requiredPermissions: ['app_resource_view'],
      resourceIdOrIds: undefined,
    });
    expect(result).toEqual({ resources: [] });
  });

  it('uses each requiredPermission as the relation and returns single-resource shape', () => {
    const result = getKesselAccessCheckParams({
      requiredPermissions: ['app_resource_view'],
      resourceIdOrIds: 'workspace-123',
    });
    expect(result).toEqual({
      resource: {
        id: 'workspace-123',
        type: 'workspace',
        reporter: { type: 'rbac' },
      },
      relation: 'app_resource_view',
    });
  });

  it('uses each requiredPermission as the relation and returns resources array for multiple', () => {
    const result = getKesselAccessCheckParams({
      requiredPermissions: ['app_resource_view', 'app_resource_edit'],
      resourceIdOrIds: 'workspace-456',
    });
    expect('resources' in result).toBe(true);
    expect((result as { resources: { relation: string }[] }).resources).toEqual([
      { id: 'workspace-456', type: 'workspace', relation: 'app_resource_view', reporter: { type: 'rbac' } },
      { id: 'workspace-456', type: 'workspace', relation: 'app_resource_edit', reporter: { type: 'rbac' } },
    ]);
  });
});

describe('getKesselAccessCheckParams with custom options (resourceType, reporter)', () => {
  it('returns host/hbi resource when options are passed (single id)', () => {
    const result = getKesselAccessCheckParams({
      requiredPermissions: ['update'],
      resourceIdOrIds: 'host-abc',
      options: { resourceType: 'host', reporter: { type: 'hbi' } },
    });
    expect(result).toEqual({
      resource: {
        id: 'host-abc',
        type: 'host',
        reporter: { type: 'hbi' },
      },
      relation: 'update',
    });
  });

  it('returns resources array with host/hbi for multiple relations', () => {
    const result = getKesselAccessCheckParams({
      requiredPermissions: ['update', 'delete'],
      resourceIdOrIds: 'host-xyz',
      options: { resourceType: 'host', reporter: { type: 'hbi' } },
    });
    expect('resources' in result).toBe(true);
    expect((result as { resources: SelfAccessCheckResourceWithRelation[] }).resources).toEqual([
      { id: 'host-xyz', type: 'host', relation: 'update', reporter: { type: 'hbi' } },
      { id: 'host-xyz', type: 'host', relation: 'delete', reporter: { type: 'hbi' } },
    ]);
  });
});

describe('getKesselAccessCheckParams with multiple resource IDs', () => {
  it('returns flat resources array (each id × each relation)', () => {
    const result = getKesselAccessCheckParams({
      requiredPermissions: ['update', 'delete'],
      resourceIdOrIds: ['host-1', 'host-2'],
      options: { resourceType: 'host', reporter: { type: 'hbi' } },
    });
    expect('resources' in result).toBe(true);
    const resources = (result as { resources: SelfAccessCheckResourceWithRelation[] }).resources;
    expect(resources).toHaveLength(4);
    expect(resources).toEqual([
      { id: 'host-1', type: 'host', relation: 'update', reporter: { type: 'hbi' } },
      { id: 'host-1', type: 'host', relation: 'delete', reporter: { type: 'hbi' } },
      { id: 'host-2', type: 'host', relation: 'update', reporter: { type: 'hbi' } },
      { id: 'host-2', type: 'host', relation: 'delete', reporter: { type: 'hbi' } },
    ]);
  });

  it('returns { resources: [] } when resourceIds array is empty', () => {
    const result = getKesselAccessCheckParams({
      requiredPermissions: ['update'],
      resourceIdOrIds: [],
      options: { resourceType: 'host', reporter: { type: 'hbi' } },
    });
    expect(result).toEqual({ resources: [] });
  });
});
