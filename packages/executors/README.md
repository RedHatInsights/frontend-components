# Frontend Components Executors

Custom Nx executors for building frontend-components packages.

## Quick Decision Guide

| Package Structure | Use This | Example |
|-------------------|----------|---------|
| `src/ComponentA/`, `src/ComponentB/` | `builder` + `build-packages` | frontend-components |
| `src/index.ts`, `src/util.ts` | `builder` | types, tsc-transform-imports |
| Custom build needs | `nx:run-commands` | config (uses FEC) |

## build-packages Executor

**When:** Directory-based components/utilities
**Gets:** Auto-generated exports field + granular imports

```typescript
// Enables both patterns:
import { Button } from '@pkg';              // barrel import
import { Button } from '@pkg/Button';       // granular import
```

**Structure:**
```
src/
├── Button/index.ts
├── Card/index.ts
└── index.ts        // barrel exports
```

## Building

Run `npx nx run @redhat-cloud-services/frontend-components-executors:build` to build this library.
