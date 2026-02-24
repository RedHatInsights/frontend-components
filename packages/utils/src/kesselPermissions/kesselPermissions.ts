import type {
  SelfAccessCheckResourceWithRelation,
  SelfAccessCheckParams as SingleSelfAccessCheckParams,
  BulkSelfAccessCheckNestedRelationsParams,
} from '@project-kessel/react-kessel-access-check/types';

export type PermissionMap = Record<string, string>;

export interface KesselResourceOptions {
  resourceType?: string;
  reporter?: { type: string };
}

const DEFAULT_RESOURCE_OPTIONS: Required<KesselResourceOptions> = {
  resourceType: 'workspace',
  reporter: { type: 'rbac' },
};

export interface GetKesselAccessCheckParamsOptions {
  permissionMap?: PermissionMap;
  requiredPermissions: string[];
  resourceIdOrIds: string | string[] | undefined;
  options?: KesselResourceOptions;
}

export type SelfAccessCheckParams =
  | SingleSelfAccessCheckParams
  | BulkSelfAccessCheckNestedRelationsParams
  | { resources: SelfAccessCheckResourceWithRelation[] };


function buildKesselResource(
  resourceId: string,
  relation: string,
  options: Required<KesselResourceOptions>
): SelfAccessCheckResourceWithRelation {
  return {
    id: resourceId,
    type: options.resourceType,
    relation,
    reporter: options.reporter,
  };
}

function getResourcesForIds(
  resourceIdOrIds: string | string[] | undefined,
  relations: string[],
  options: Required<KesselResourceOptions>
): SelfAccessCheckResourceWithRelation[] {
  if (!resourceIdOrIds || relations.length === 0) {
    return [];
  }
  const ids = Array.isArray(resourceIdOrIds) ? resourceIdOrIds : [resourceIdOrIds];
  if (ids.length === 0) {
    return [];
  }
  return ids.flatMap((resourceId) =>
    relations.map((relation) => buildKesselResource(resourceId, relation, options))
  );
}

function mapPermissionsToKessel(
  permissionMap: PermissionMap,
  requiredPermissions: string[],
  resourceIdOrIds: string | string[] | undefined,
  options: Required<KesselResourceOptions>
): SelfAccessCheckResourceWithRelation[] {
  const relations = requiredPermissions
    .map((perm) => {
      const relation = permissionMap[perm];
      if (!relation) {
        console.warn(`No Kessel mapping for: ${perm}`);
        return null;
      }
      return relation;
    })
    .filter((r): r is string => r !== null);
  return getResourcesForIds(resourceIdOrIds, relations, options);
}

function requiredPermissionsToKesselResources(
  requiredPermissions: string[],
  resourceIdOrIds: string | string[] | undefined,
  options: Required<KesselResourceOptions>
): SelfAccessCheckResourceWithRelation[] {
  return getResourcesForIds(resourceIdOrIds, requiredPermissions, options);
}

function buildSelfAccessCheckParams(
  resources: SelfAccessCheckResourceWithRelation[]
): SelfAccessCheckParams {
  if (resources.length === 1) {
    const resource = resources[0];
    return {
      resource: {
        id: resource.id,
        type: resource.type,
        reporter: resource.reporter,
      },
      relation: resource.relation,
    };
  }
  return { resources };
}

/**
 * Build useSelfAccessCheck params from permissions and resource id(s).
 *
 * @param params - Options object: permissionMap (optional), requiredPermissions, resourceIdOrIds, options (optional resourceType/reporter).
 * @returns Params for useSelfAccessCheck.
 */
export function getKesselAccessCheckParams(
  params: GetKesselAccessCheckParamsOptions
): SelfAccessCheckParams {
  const { permissionMap, requiredPermissions, resourceIdOrIds, options } = params;
  const resolvedOptions = { ...DEFAULT_RESOURCE_OPTIONS, ...options };
  const resources =
    permissionMap !== undefined
      ? mapPermissionsToKessel(
          permissionMap,
          requiredPermissions,
          resourceIdOrIds,
          resolvedOptions
        )
      : requiredPermissionsToKesselResources(
          requiredPermissions,
          resourceIdOrIds,
          resolvedOptions
        );
  return buildSelfAccessCheckParams(resources);
}
