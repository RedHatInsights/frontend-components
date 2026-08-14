# NX workspace manager

For detailed documentation please read the official [nx documentation](https://nx.dev/getting-started/intro).

## Handling deprecated/moved packages

Rhe following package directories were moved or removed from the project. It can happen that these packages will not be properly handled but git. Check with the `git status` command for any ghost directories in your `packages` dir. The following directories should not be in your packages:

- docs (moved)
- demo (moved)
- charts (removed)
- pdf-generator (removed)

If any of these directories exist, remove them.

### Failing build or cypress component tests

```sh
Error: ENOENT: no such file or directory, open '/Users/martin/insights/frontend-components/packages/charts/package.json'
```

This error occurs because the package was removed, but your local repository still have the package directory. Make sure that your `packages/` does not the following directories:
- docs (moved)
- demo (moved)
- charts (removed)
- pdf-generator (removed)

If any of these directories exist, remove them.

## Breaking changes

### @redhat-cloud-services/frontend-components-advisor-components

*This package contained circular dependencies/imports which are no longer allowed. Some import paths have changed!*

#### RuleDetailsMessages

The location of this module changed!

```diff
- RuleDetails/RuleDetails
+ RuleDetails/RuleDetailsMessages
```

#### Message

The location of this module changed!


```diff
- RuleDetails/RuleDetails
+ RuleDetails/RuleDetailsMessages
```

### @redhat-cloud-services/frontend-components-charts

This package was removed. Follow the [migration guide](./charts.md) to learn about alternatives.

### @redhat-cloud-services/frontend-components

### AsyncComponent

This component no longer accepts the `appName` props. This is a legacy prop. Use `scope` instead.

### GroupItem

The location of this module changed!

```diff
- ConditionalFilter/GroupFilter
+ ConditionalFilter/groupFilterConstants
```

### Group

The location of this module changed!

```diff
- ConditionalFilter/GroupFilter
+ ConditionalFilter/groupFilterConstants
```

### FilterHook GroupItem (renamed)

This module had duplicate name!

```diff
- GroupItem
+ FilterHookGroupItem
```

### TreeTableRow

The location of this module changed!

```diff
- TreeTable/rowWrapper
+ TreeTable/helpers
```

### @redhat-cloud-services/frontend-components-utilities

#### usePDFExport

This module was causing a circular dependency with the `@redhat-cloud-services/frontend-components-notifications` package!

The automated notifications dispatch was removed on the export PDF promise resolution or rejection. The se notifications even should be handled by the consuming code, not internally in the pdf export function!

### @redhat-cloud-services/frontend-components-config-utilities

#### Standalone

The standalone version of development environment was removed. The feature was not supported for a long time and its superseded by ephemeral environments.
