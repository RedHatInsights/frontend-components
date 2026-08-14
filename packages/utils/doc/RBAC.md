# RBAC Utilities

## usePermissionsWithContext

Use `usePermissionsWithContext` if your application is already wrapped in the `RBACProvider` component. Besides the required permissions (`requiredPermissions`), you can also provide `checkAll` flag: if true, `hasAccess` will evaluate to true only when *all* the required permissions are fulfilled. Otherwise, `hasAccess` becomes true when *at least one* of the required permissions is fulfilled.

### Resource definitions

`requiredPermissions` can be of the `Access` type (see the source code). If your `RBACProvider` has explicitly set `checkResourceDefinitions` to true, then you are able to validate resource definitions together with normal RBAC permissions.

It is expected that resource definitions conform the insights-rbac project's format: https://github.com/RedHatInsights/insights-rbac/blob/master/docs/source/management/role.rst#resource-definitions. All the definitions must have `key`, `operation` and `value` defined.

![RBAC flow diagram](./rbac-flow.svg "RBAC flow diagram")

## usePermissions

Use `usePermissions` if you do not want to wrap your application in the `RBACProvider` component or want to instantly validate access with one function call.

### Resource definitions

If `checkResourceDefinitions` (the function argument) is set to true, then resource definitions will be validated, if present, together with normal RBAC permissions. You can opt out of this check (have so-called loose authorization) by not specifying the argument or setting it to false (set by default).

See more details about resource definitions handling above in the `usePermissionsWithContext` section.

