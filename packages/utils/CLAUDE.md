# Utils Package

## Overview

Collection of 67+ utility functions, hooks, and helpers for Red Hat Cloud Services applications. Covers Redux patterns, RBAC, routing, API interceptors, data fetching, and more.

**Package**: `@redhat-cloud-services/frontend-components-utilities`  
**Dependencies**: Required by `@redhat-cloud-services/frontend-components`

## Categories

- **Redux**: Registry, ReducerRegistry, MiddlewareListener
- **Authorization**: RBAC, RBACHook, kesselPermissions
- **Routing**: RouterParams, useInsightsNavigate
- **Data Fetching**: useFetchBatched, usePromiseQueue, interceptors
- **UI Helpers**: RowLoader, parseCvssScore, useSuspenseLoader
- **Export**: useExportPDF
- **Testing**: TestingUtils
- **Performance**: debounce
- **Inventory**: useInventory
- **Styles**: SCSS helpers

## Quick Reference

```typescript
// Redux
import { getRegistry, ReducerRegistry, MiddlewareListener } from '@redhat-cloud-services/frontend-components-utilities/Registry';

// RBAC
import { doesHavePermissions } from '@redhat-cloud-services/frontend-components-utilities/RBAC';
import { usePermissions } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';

// Routing
import RouterParams from '@redhat-cloud-services/frontend-components-utilities/RouterParams';
import useInsightsNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';

// Hooks
import useFetchBatched from '@redhat-cloud-services/frontend-components-utilities/useFetchBatched';
import usePromiseQueue from '@redhat-cloud-services/frontend-components-utilities/usePromiseQueue';

// Helpers
import debounce from '@redhat-cloud-services/frontend-components-utilities/debounce';
import { interceptors } from '@redhat-cloud-services/frontend-components-utilities/interceptors';
```

## Redux Utilities

### Registry / ReducerRegistry

Dynamic reducer registration for code splitting.

```typescript
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import { ReducerRegistry } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';

// Setup store with registry
const registry = new ReducerRegistry({}, [
  // Initial middlewares
]);

const store = registry.getStore();

// Later: Register reducer dynamically
registry.register({
  myFeature: myFeatureReducer
});

// Or use singleton
const store = getRegistry().register({
  anotherFeature: anotherReducer
}).getStore();
```

**Use case**: Lazy-load reducers when modules load

**See**: [Redux Doc](./doc/redux.md)

### MiddlewareListener

Redux middleware that listens to actions and can cancel/fire additional actions.

```typescript
import { MiddlewareListener } from '@redhat-cloud-services/frontend-components-utilities/MiddlewareListener';

const listener = new MiddlewareListener();

// Add listener
listener.addNew({
  on: 'ACTION_TYPE',
  callback: (action, store) => {
    // React to action
    console.log('Action fired', action);
    
    // Optionally dispatch new action
    return { type: 'ADDITIONAL_ACTION' };
  }
});

// Add to middleware chain
const store = createStore(
  reducer,
  applyMiddleware(listener.getMiddleware())
);

// Remove listener
listener.removeListener(listenerKey);
```

**Use cases**:
- Side effects without sagas/thunks
- Action transformation
- Debugging/logging
- Cancel actions conditionally

## RBAC (Role-Based Access Control)

### doesHavePermissions

Check if user has required permissions.

```typescript
import { doesHavePermissions } from '@redhat-cloud-services/frontend-components-utilities/RBAC';

// Check single permission
const canWrite = doesHavePermissions(
  userPermissions,
  [{ permission: 'inventory:hosts:write' }]
);

// Check multiple with AND
const hasAll = doesHavePermissions(
  userPermissions,
  [
    { permission: 'inventory:*:read' },
    { permission: 'inventory:hosts:write' }
  ],
  false  // require ALL
);

// Check multiple with OR
const hasAny = doesHavePermissions(
  userPermissions,
  [
    { permission: 'inventory:hosts:write' },
    { permission: 'inventory:hosts:admin' }
  ],
  true  // require ANY
);
```

**Supports**:
- Wildcard permissions (`inventory:*:read`)
- AND/OR logic
- Resource-specific checks

**See**: [RBAC Doc](./doc/RBAC.md)

### usePermissions (RBACHook)

React hook for permission checking.

```typescript
import { usePermissions } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';

function MyComponent() {
  const { hasAccess, isLoading } = usePermissions('inventory', [
    'inventory:hosts:read',
    'inventory:hosts:write'
  ]);
  
  if (isLoading) {
    return <Spinner />;
  }
  
  if (!hasAccess) {
    return <NotAuthorized />;
  }
  
  return <ProtectedContent />;
}
```

**Features**:
- Automatic loading state
- Permission caching
- App-scoped checks

### kesselPermissions

Integration with Kessel permissions service.

```typescript
import { useKesselPermissions } from '@redhat-cloud-services/frontend-components-utilities/kesselPermissions';

function MyComponent() {
  const { hasPermission, isLoading } = useKesselPermissions();
  
  const canEdit = hasPermission('resource:action');
  
  return canEdit ? <EditButton /> : null;
}
```

**New**: Kessel-based authorization (next-gen RBAC)

## Routing Utilities

### RouterParams

HOC to map route params to component props.

```typescript
import RouterParams from '@redhat-cloud-services/frontend-components-utilities/RouterParams';

function MyComponent({ id, name }) {
  // id and name from route params
  return <div>{id} - {name}</div>;
}

export default RouterParams(MyComponent);

// Route: /items/:id/:name
// URL: /items/123/foo
// Props: { id: '123', name: 'foo' }
```

**Alternative**: Use `useParams()` hook from react-router-dom v6

**See**: [RouterParams Doc](./doc/routerParams.md)

### useInsightsNavigate

Navigate with insights-chrome analytics tracking.

```typescript
import useInsightsNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';

function MyComponent() {
  const navigate = useInsightsNavigate();
  
  const handleClick = () => {
    // Tracked navigation
    navigate('/insights/dashboard');
    
    // With state
    navigate('/items/123', { state: { from: 'list' } });
  };
  
  return <button onClick={handleClick}>Go</button>;
}
```

**Benefit**: Automatic analytics tracking via chrome

## Data Fetching Hooks

### useFetchBatched

Batch multiple API requests together.

```typescript
import useFetchBatched from '@redhat-cloud-services/frontend-components-utilities/useFetchBatched';

function MyComponent() {
  const { 
    fetchBatched, 
    isLoading, 
    errors, 
    data 
  } = useFetchBatched();
  
  useEffect(() => {
    fetchBatched([
      { url: '/api/users' },
      { url: '/api/systems' },
      { url: '/api/settings' }
    ]);
  }, []);
  
  if (isLoading) return <Spinner />;
  if (errors.length) return <Error errors={errors} />;
  
  const [users, systems, settings] = data;
  return <Dashboard {...{ users, systems, settings }} />;
}
```

**Features**:
- Parallel requests
- Unified loading state
- Error handling per request
- Results in request order

### usePromiseQueue

Execute promises sequentially in a queue.

```typescript
import usePromiseQueue from '@redhat-cloud-services/frontend-components-utilities/usePromiseQueue';

function BulkActions() {
  const { add, isProcessing, queue } = usePromiseQueue();
  
  const handleBulkDelete = (items) => {
    items.forEach(item => {
      add(() => deleteItem(item.id));
    });
  };
  
  return (
    <div>
      <Button onClick={handleBulkDelete} disabled={isProcessing}>
        Delete All
      </Button>
      {isProcessing && <Progress value={queue.completed} max={queue.total} />}
    </div>
  );
}
```

**Use cases**:
- Rate-limited API calls
- Sequential processing
- Bulk operations
- Progress tracking

### interceptors

Axios interceptors for auth, error handling, and retries.

```typescript
import { interceptors } from '@redhat-cloud-services/frontend-components-utilities/interceptors';
import axios from 'axios';

// Apply default interceptors
const client = axios.create();
interceptors(client);

// Custom configuration
interceptors(client, {
  // Add auth token
  authInterceptor: (config) => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  
  // Handle errors
  errorInterceptor: (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
    }
    return Promise.reject(error);
  }
});
```

**Includes**:
- Auth token injection
- Error normalization
- Retry logic
- Response transformation

## UI Helper Components

### RowLoader

Skeleton loader for table rows.

```typescript
import RowLoader from '@redhat-cloud-services/frontend-components-utilities/RowLoader';

function MyTable({ isLoading, data }) {
  if (isLoading) {
    return <RowLoader rows={5} columns={4} />;
  }
  
  return <Table data={data} />;
}
```

**Props**:
- `rows`: Number of skeleton rows
- `columns`: Number of columns

### parseCvssScore

Parse and format CVSS security scores.

```typescript
import parseCvssScore from '@redhat-cloud-services/frontend-components-utilities/parseCvssScore';

const score = parseCvssScore(7.5);
// Returns: { label: 'Important', severity: 'important', color: 'orange' }

<Badge color={score.color}>{score.label}</Badge>
```

**CVSS Ranges**:
- 0.0-3.9: Low
- 4.0-6.9: Moderate
- 7.0-8.9: Important
- 9.0-10.0: Critical

### useSuspenseLoader

Show loading state with React Suspense pattern.

```typescript
import useSuspenseLoader from '@redhat-cloud-services/frontend-components-utilities/useSuspenseLoader';

function MyComponent() {
  const { load, data, error } = useSuspenseLoader();
  
  useEffect(() => {
    load(() => fetchData());
  }, []);
  
  if (error) return <Error error={error} />;
  return <Content data={data} />;
}
```

## Export Utilities

### useExportPDF

Export page content as PDF.

```typescript
import useExportPDF from '@redhat-cloud-services/frontend-components-utilities/useExportPDF';

function ReportPage() {
  const { exportPDF, isExporting } = useExportPDF();
  
  const handleExport = () => {
    exportPDF({
      elementId: 'report-content',
      filename: 'report.pdf',
      title: 'My Report'
    });
  };
  
  return (
    <div>
      <button onClick={handleExport} disabled={isExporting}>
        Export PDF
      </button>
      <div id="report-content">
        {/* Content to export */}
      </div>
    </div>
  );
}
```

**Features**:
- Client-side PDF generation
- Loading state
- Custom filename
- Element selector

## Performance Utilities

### debounce

Debounce function calls.

```typescript
import debounce from '@redhat-cloud-services/frontend-components-utilities/debounce';

function SearchInput() {
  const [query, setQuery] = useState('');
  
  const debouncedSearch = debounce((value) => {
    fetchResults(value);
  }, 500);
  
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };
  
  return <input value={query} onChange={handleChange} />;
}
```

**See**: [Debounce Doc](./doc/debounce.md)

## Inventory Integration

### useInventory

Integration with Inventory UI.

```typescript
import useInventory from '@redhat-cloud-services/frontend-components-utilities/useInventory';

function SystemsList() {
  const { 
    InventoryTable, 
    inventoryConnector,
    mergeWithEntities 
  } = useInventory();
  
  return (
    <InventoryTable
      columns={columns}
      onSelect={handleSelect}
    />
  );
}
```

**Note**: Inventory packages moved to separate repo

## Testing Utilities

### TestingUtils

Helpers for testing components.

```typescript
import { TestingUtils } from '@redhat-cloud-services/frontend-components-utilities/TestingUtils';

// Mock functions, test helpers, etc.
```

**Note**: See [testing](../testing/) package for full testing utilities

## Styles (SCSS)

SCSS helper functions and mixins.

```scss
@import '~@redhat-cloud-services/frontend-components-utilities/styles/all';

// Use utility mixins
.my-class {
  @include pf-rem(16);  // Convert px to rem
}
```

**See**: `src/styles/` directory for available mixins

## Common Patterns

### Redux Store Setup

```typescript
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import { MiddlewareListener } from '@redhat-cloud-services/frontend-components-utilities/MiddlewareListener';

const listener = new MiddlewareListener();
const registry = getRegistry({}, [
  listener.getMiddleware(),
  // other middleware
]);

// Register reducers
registry.register({
  notifications: notificationsReducer,
  user: userReducer
});

const store = registry.getStore();
```

### Protected Component with RBAC

```typescript
import { usePermissions } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';

function ProtectedComponent() {
  const { hasAccess, isLoading } = usePermissions('inventory', [
    'inventory:hosts:write'
  ]);
  
  if (isLoading) {
    return <Spinner />;
  }
  
  if (!hasAccess) {
    return <NotAuthorized />;
  }
  
  return <SensitiveContent />;
}
```

### Batched Data Loading

```typescript
import useFetchBatched from '@redhat-cloud-services/frontend-components-utilities/useFetchBatched';

function Dashboard() {
  const { fetchBatched, isLoading, data } = useFetchBatched();
  
  useEffect(() => {
    fetchBatched([
      { url: '/api/summary' },
      { url: '/api/alerts' },
      { url: '/api/systems' }
    ]);
  }, []);
  
  if (isLoading) return <Spinner />;
  
  const [summary, alerts, systems] = data;
  return <DashboardView {...{ summary, alerts, systems }} />;
}
```

### Debounced Search

```typescript
import debounce from '@redhat-cloud-services/frontend-components-utilities/debounce';

function SearchBar() {
  const debouncedSearch = useMemo(
    () => debounce((query) => performSearch(query), 300),
    []
  );
  
  return (
    <input 
      type="search"
      onChange={(e) => debouncedSearch(e.target.value)}
    />
  );
}
```

## Migration Guide (v2 → v3)

### Import Path Changes

```typescript
// v2
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/files/Registry';

// v3
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
```

### RowLoader

```typescript
// v2
import { RowLoader } from '@redhat-cloud-services/frontend-components-utilities/helpers';

// v3
import RowLoader from '@redhat-cloud-services/frontend-components-utilities/RowLoader';
```

### parseCvssScore

```typescript
// v2
import { parseCvssScore } from '@redhat-cloud-services/frontend-components-utilities/helpers';

// v3
import parseCvssScore from '@redhat-cloud-services/frontend-components-utilities/parseCvssScore';
```

### SCSS Imports

```scss
/* v2 */
@import '~@redhat-cloud-services/frontend-components-utilities/files/styles/all';

/* v3 */
@import '~@redhat-cloud-services/frontend-components-utilities/styles/all';
```

## Common Issues

### Registry Not Found
**Error**: "Cannot read property 'register' of undefined"  
**Solution**: Initialize registry with `getRegistry()` before use

### RBAC Hook Not Working
**Check**:
- Chrome provider initialized
- App name matches RBAC configuration
- Permissions format correct

### Debounce Not Working
**Check**:
- Function recreated on every render (use `useMemo`)
- Cleanup on unmount

### Interceptor Not Applied
**Check**:
- Call `interceptors(client)` before making requests
- Axios instance used (not default axios)

## Testing

```bash
# Unit tests
npx nx run @redhat-cloud-services/frontend-components-utilities:test:unit

# Build
npx nx run @redhat-cloud-services/frontend-components-utilities:build

# Lint
npx nx run @redhat-cloud-services/frontend-components-utilities:lint
```

## Documentation

- [Main README](./README.md)
- [Redux Guide](./doc/redux.md)
- [RouterParams](./doc/routerParams.md)
- [Debounce](./doc/debounce.md)
- [Cypress Helpers](./doc/Cypress.md)
- [RBAC](./doc/RBAC.md)

## Performance Tips

1. **Registry**: Only register reducers when needed (lazy loading)
2. **Debounce**: Use for search, resize, scroll handlers
3. **Batched Fetch**: Reduce waterfall requests
4. **Promise Queue**: Prevent rate limit errors
5. **Memoization**: Wrap debounced functions in `useMemo`

## Best Practices

### Redux

- Use ReducerRegistry for code-split apps
- Register reducers when module loads
- Clean up reducers when module unloads
- Use MiddlewareListener for simple side effects

### RBAC

- Check permissions at component level
- Use loading states from hook
- Fail closed (deny by default)
- Wildcard permissions for broader access

### Data Fetching

- Batch parallel requests with `useFetchBatched`
- Queue sequential requests with `usePromiseQueue`
- Add interceptors to axios instances
- Handle errors at component level

### Performance

- Debounce user input (search, autocomplete)
- Lazy load reducers with Registry
- Memoize expensive calculations
- Clean up effects and timers

## Contributing

When adding new utilities:

1. Create directory: `src/<utility-name>/`
2. Add implementation: `<utility-name>.ts(x)`
3. Export from `index.ts`
4. Add tests: `<utility-name>.test.ts(x)`
5. Export from package root: `src/index.ts`
6. Update README if significant
7. Add documentation if complex

## Related Packages

- [components](../components/) - Uses these utilities
- [testing](../testing/) - Testing-specific utilities
- [chrome](../chrome/) - Chrome integration
