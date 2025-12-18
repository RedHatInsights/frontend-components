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

## Architecture

### No Building Required

**Executors run directly from TypeScript source** - Nx uses ts-node to execute `.ts` files without compilation.

Since this is a private workspace package (not published to npm), there's no need to build the executors for general use.

### Exception: SCSS Workspace Importer

The **only component that requires building** is the SCSS workspace importer:

```bash
npx nx run @redhat-cloud-services/frontend-components-executors:build-scss-importer
```

This builds `scss-workspace-importer.ts` to JavaScript so the demo app can `require()` it from CommonJS.

**When it's built automatically:**
- Demo app builds (`@redhat-cloud-services/frontend-components-demo-app:build`)
- Any package that depends on the demo app

**Manual build only needed for:**
- Demo app development without running the full demo build
- Debugging SCSS workspace resolution issues
