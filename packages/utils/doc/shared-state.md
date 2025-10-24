# Shared State Management

Lightweight, type-safe state management for sharing **small amounts of state** between Scalprum modules. Designed for module-to-module communication, not as a replacement for global state management.

## Scope

**✅ Use for:** Small shared state between Scalprum modules (user preferences, UI state, selections)
**❌ Don't use for:** Application-wide global state, complex state trees, replacing Redux/Zustand
**Size limit:** Small objects with 5-10 properties maximum

## Installation

```bash
npm install @redhat-cloud-services/frontend-components-utilities
```

## Quick Start

```typescript
import { createSharedStore, useGetState, useSubscribeStore } from '@redhat-cloud-services/frontend-components-utilities';

// 1. Create store with events that accept payloads
const store = createSharedStore({
  initialState: { count: 0, theme: 'light' },
  events: ['COUNT', 'SET_THEME'] as const,
  onEventChange: (state, event, payload) => {
    switch (event) {
      case 'COUNT':
        return { ...state, count: state.count + payload }; // +5, -3, etc.
      case 'SET_THEME':
        return { ...state, theme: payload }; // 'dark', 'light'
      default:
        return state;
    }
  }
});

// 2. Read all state (re-renders on any change)
const GlobalReader = () => {
  const state = useGetState(store);
  return <pre>{JSON.stringify(state, null, 2)}</pre>;
};

// 3. Subscribe to specific events (optimized - only re-renders for COUNT events)
const Counter = () => {
  const count = useSubscribeStore(store, 'COUNT', state => state.count);
  return <div>Count: {count}</div>;
};

// 4. Update state with payloads
const Controls = () => (
  <div>
    <button onClick={() => store.updateState('COUNT', 1)}>+1</button>
    <button onClick={() => store.updateState('COUNT', -1)}>-1</button>
    <button onClick={() => store.updateState('SET_THEME', 'dark')}>Dark Theme</button>
  </div>
);
```

## Examples

### COUNT Event Pattern

This demonstrates using a single event with payloads instead of separate increment/decrement events:

```typescript
const counterStore = createSharedStore({
  initialState: { count: 0 },
  events: ['COUNT'] as const,
  onEventChange: (state, event, payload) => ({
    ...state,
    count: state.count + payload
  })
});

// Component with flexible step control
const CounterUpdater = () => {
  const [step, setStep] = useState(1);

  return (
    <div>
      <input
        type="number"
        value={step}
        onChange={(e) => setStep(Number(e.target.value))}
      />

      {/* Same COUNT event, different payloads */}
      <button onClick={() => counterStore.updateState('COUNT', step)}>
        +{step}
      </button>
      <button onClick={() => counterStore.updateState('COUNT', -step)}>
        -{step}
      </button>
      <button onClick={() => {
        const currentCount = counterStore.getState().count;
        counterStore.updateState('COUNT', -currentCount);
      }}>
        Reset
      </button>
    </div>
  );
};

// Component that only re-renders on COUNT events
const CountDisplay = () => {
  const count = useSubscribeStore(counterStore, 'COUNT', state => state.count);
  return <h2>Count: {count}</h2>;
};
```

### User Input with Selectors

```typescript
const appStore = createSharedStore({
  initialState: {
    user: { name: 'John', email: 'john@example.com' },
    inputValue: ''
  },
  events: ['SET_USER', 'SET_INPUT'] as const,
  onEventChange: (state, event, payload) => {
    switch (event) {
      case 'SET_USER':
        return { ...state, user: { ...state.user, ...payload } };
      case 'SET_INPUT':
        return { ...state, inputValue: payload };
      default:
        return state;
    }
  }
});

// Component using selector to transform data
const UserDisplay = () => {
  const userInfo = useSubscribeStore(appStore, 'SET_USER', state =>
    `${state.user.name} (${state.user.email})`
  );
  return <div>{userInfo}</div>;
};

// Input component that updates state
const TextInput = () => {
  const inputValue = useSubscribeStore(appStore, 'SET_INPUT', state => state.inputValue);

  return (
    <input
      value={inputValue}
      onChange={(e) => appStore.updateState('SET_INPUT', e.target.value)}
    />
  );
};
```

## API Reference

### createSharedStore(config)

```typescript
createSharedStore<S, E extends readonly string[]>({
  initialState: S,                    // Any type - your state shape
  events: E,                         // Array of event names (use "as const")
  onEventChange: (state, event, payload) => S  // Pure function returning new state
})
```

**Parameters:**

| Property | Type | Description |
|----------|------|-------------|
| initialState | `S` | Initial state - any type (object, primitive, array) |
| events | `readonly string[]` | Event names (use `as const` for type safety) |
| onEventChange | `(state: S, event: E[number], payload: any) => S` | Pure function that returns new state |

**Returns:** Store object with methods:
- `getState()` - Get current state
- `updateState(event, payload)` - Trigger event with payload
- `subscribe(event, callback)` - Subscribe to specific events

### useGetState(store)

Hook that subscribes to all store changes. Re-renders on any state update.

```typescript
const state = useGetState(store); // Full state object
```

### useSubscribeStore(store, event, selector)

Hook that subscribes to specific events only. Optimized for performance.

```typescript
const value = useSubscribeStore(
  store,
  'EVENT_NAME',               // Event to listen for
  (state) => state.property   // Selector function
);
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| store | Store | Store instance from `createSharedStore` |
| event | Event name | Specific event to subscribe to |
| selector | `(state: S) => T` | Function to extract/transform state |

**Selector Examples:**
```typescript
// Extract property
useSubscribeStore(store, 'UPDATE_USER', state => state.user.name)

// Transform data
useSubscribeStore(store, 'UPDATE_LIST', state => state.items.length)

// Compute values
useSubscribeStore(store, 'UPDATE_CART', state =>
  state.items.reduce((sum, item) => sum + item.price, 0)
)
```

## Performance Benefits

Components using `useSubscribeStore` only re-render when their specific event is triggered:

```typescript
// This component only re-renders when 'UPDATE_THEME' events fire
const ThemeComponent = () => {
  const theme = useSubscribeStore(store, 'UPDATE_THEME', state => state.theme);
  return <div className={theme}>Content</div>;
};

// Updates to user data won't re-render ThemeComponent
store.updateState('UPDATE_USER', { name: 'Jane' }); // No re-render
store.updateState('UPDATE_THEME', 'dark');          // Re-renders ThemeComponent
```

## Scalprum Module Patterns

This shared state system is designed to work seamlessly with [Scalprum remote hooks](https://github.com/scalprum/scaffolding/blob/main/packages/react-core/docs/use-remote-hook.md) for powerful cross-module communication.

### User Preferences Across Modules

```typescript
// shared-stores/user-preferences.ts
export const userPreferencesStore = createSharedStore({
  initialState: {
    theme: 'light',
    language: 'en',
    sidebarCollapsed: false,
    tablePageSize: 20
  },
  events: ['UPDATE_THEME', 'UPDATE_LANGUAGE', 'TOGGLE_SIDEBAR', 'SET_PAGE_SIZE'] as const,
  onEventChange: (state, event, payload) => {
    switch (event) {
      case 'UPDATE_THEME':
        return { ...state, theme: payload };
      case 'UPDATE_LANGUAGE':
        return { ...state, language: payload };
      case 'TOGGLE_SIDEBAR':
        return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
      case 'SET_PAGE_SIZE':
        return { ...state, tablePageSize: payload };
      default:
        return state;
    }
  }
});

// Module A: Settings Panel
import { userPreferencesStore } from '../shared-stores/user-preferences';

const SettingsPanel = () => {
  const theme = useSubscribeStore(userPreferencesStore, 'UPDATE_THEME', state => state.theme);
  const pageSize = useSubscribeStore(userPreferencesStore, 'SET_PAGE_SIZE', state => state.tablePageSize);

  return (
    <div>
      <select
        value={theme}
        onChange={(e) => userPreferencesStore.updateState('UPDATE_THEME', e.target.value)}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>

      <select
        value={pageSize}
        onChange={(e) => userPreferencesStore.updateState('SET_PAGE_SIZE', Number(e.target.value))}
      >
        <option value={10}>10 per page</option>
        <option value={20}>20 per page</option>
        <option value={50}>50 per page</option>
      </select>
    </div>
  );
};

// Module B: Data Table - responds to page size changes only
const DataTable = () => {
  const pageSize = useSubscribeStore(userPreferencesStore, 'SET_PAGE_SIZE', state => state.tablePageSize);
  // This component won't re-render when theme changes, only when page size changes

  return <div>Showing {pageSize} items per page</div>;
};

// Module C: Header - responds to theme changes only
const Header = () => {
  const theme = useSubscribeStore(userPreferencesStore, 'UPDATE_THEME', state => state.theme);
  // This component won't re-render when page size changes, only when theme changes

  return <header className={`header--${theme}`}>Header</header>;
};
```

### Selection State Between Modules

```typescript
// shared-stores/selection.ts
export const selectionStore = createSharedStore({
  initialState: {
    selectedItems: [] as string[],
    lastSelectedId: null as string | null,
    selectionMode: 'single' as 'single' | 'multiple'
  },
  events: ['SELECT_ITEM', 'DESELECT_ITEM', 'CLEAR_SELECTION', 'SET_MODE'] as const,
  onEventChange: (state, event, payload) => {
    switch (event) {
      case 'SELECT_ITEM':
        if (state.selectionMode === 'single') {
          return { ...state, selectedItems: [payload], lastSelectedId: payload };
        }
        return {
          ...state,
          selectedItems: [...state.selectedItems, payload],
          lastSelectedId: payload
        };
      case 'DESELECT_ITEM':
        return {
          ...state,
          selectedItems: state.selectedItems.filter(id => id !== payload),
          lastSelectedId: state.selectedItems.length > 1 ? state.selectedItems[0] : null
        };
      case 'CLEAR_SELECTION':
        return { ...state, selectedItems: [], lastSelectedId: null };
      case 'SET_MODE':
        return { ...state, selectionMode: payload, selectedItems: [], lastSelectedId: null };
      default:
        return state;
    }
  }
});

// Module A: Item List
const ItemList = () => {
  const selectedItems = useSubscribeStore(selectionStore, 'SELECT_ITEM', state => state.selectedItems);

  return (
    <div>
      {items.map(item => (
        <div
          key={item.id}
          className={selectedItems.includes(item.id) ? 'selected' : ''}
          onClick={() => selectionStore.updateState('SELECT_ITEM', item.id)}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
};

// Module B: Selection Actions Panel
const SelectionActions = () => {
  const count = useSubscribeStore(selectionStore, 'SELECT_ITEM', state => state.selectedItems.length);

  return (
    <div>
      {count > 0 && (
        <button onClick={() => selectionStore.updateState('CLEAR_SELECTION')}>
          Clear {count} selected items
        </button>
      )}
    </div>
  );
};
```

### Combining with Scalprum Remote Hooks

Shared state works perfectly with Scalprum remote hooks. Remote modules manage their own shared state internally and expose hooks that provide both state AND functionality to consuming modules:

```typescript
// Remote Module: user-management (federated)
// Internal shared state + exported remote hooks

// internal: user-store.ts (not exported)
const userStore = createSharedStore({
  initialState: {
    currentUser: null as User | null,
    preferences: { theme: 'light', language: 'en' }
  },
  events: ['SET_USER', 'UPDATE_PREFERENCES', 'LOGOUT'] as const,
  onEventChange: (state, event, payload) => {
    switch (event) {
      case 'SET_USER':
        return { ...state, currentUser: payload };
      case 'UPDATE_PREFERENCES':
        return { ...state, preferences: { ...state.preferences, ...payload } };
      case 'LOGOUT':
        return { ...state, currentUser: null };
      default:
        return state;
    }
  }
});

// exported: useUserManagement.ts
export const useUserManagement = () => {
  const currentUser = useSubscribeStore(userStore, 'SET_USER', state => state.currentUser);

  const login = useCallback(async (credentials) => {
    const user = await authService.login(credentials);
    userStore.updateState('SET_USER', user);
    return user;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    userStore.updateState('LOGOUT');
  }, []);

  const updatePreferences = useCallback((preferences) => {
    userStore.updateState('UPDATE_PREFERENCES', preferences);
  }, []);

  return {
    currentUser,
    login,
    logout,
    updatePreferences,
    isLoggedIn: !!currentUser
  };
};

// exported: useUserPreferences.ts - focused hook for just preferences
export const useUserPreferences = () => {
  const preferences = useSubscribeStore(userStore, 'UPDATE_PREFERENCES', state => state.preferences);

  const updateTheme = useCallback((theme) => {
    userStore.updateState('UPDATE_PREFERENCES', { theme });
  }, []);

  const updateLanguage = useCallback((language) => {
    userStore.updateState('UPDATE_PREFERENCES', { language });
  }, []);

  return {
    preferences,
    updateTheme,
    updateLanguage
  };
};
```

```typescript
// Host Application: Uses ONLY remote hooks (no direct imports)

import { useRemoteHook, UseRemoteHookResult } from '@scalprum/react-core';

interface UserManagementHook {
  currentUser: User | null;
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  isLoggedIn: boolean;
}

// Component using authentication remote hook
const LoginPanel = () => {
  const { hookResult: userMgmt, loading, error }: UseRemoteHookResult<UserManagementHook> = useRemoteHook({
    scope: 'user-management',
    module: './useUserManagement'
  });

  if (loading) return <div>Loading user management...</div>;
  if (error) return <div>Error loading user features</div>;

  return (
    <div>
      {userMgmt?.isLoggedIn ? (
        <div>
          <span>Welcome, {userMgmt.currentUser?.name}!</span>
          <button onClick={userMgmt.logout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => userMgmt?.login({ email: 'user@example.com', password: '***' })}>
          Login
        </button>
      )}
    </div>
  );
};

interface UserPreferencesHook {
  preferences: {
    theme: 'light' | 'dark';
    language: string;
  };
  updateTheme: (theme: 'light' | 'dark') => void;
  updateLanguage: (language: string) => void;
}

// Different component using preferences remote hook
const ThemeToggle = () => {
  const { hookResult: prefs }: UseRemoteHookResult<UserPreferencesHook> = useRemoteHook({
    scope: 'user-management',
    module: './useUserPreferences'
  });

  return (
    <button onClick={() => prefs?.updateTheme(
      prefs.preferences.theme === 'light' ? 'dark' : 'light'
    )}>
      Switch to {prefs?.preferences.theme === 'light' ? 'Dark' : 'Light'} Theme
    </button>
  );
};

// Another component that also uses preferences - same shared state, different hook instance
const LanguageSelector = () => {
  const { hookResult: prefs }: UseRemoteHookResult<UserPreferencesHook> = useRemoteHook({
    scope: 'user-management',
    module: './useUserPreferences'
  });

  return (
    <select
      value={prefs?.preferences.language || 'en'}
      onChange={(e) => prefs?.updateLanguage(e.target.value)}
    >
      <option value="en">English</option>
      <option value="es">Spanish</option>
      <option value="fr">French</option>
    </select>
  );
};
```

**Key Benefits:**
- **True microfrontend architecture**: Host app has no direct dependencies on remote state
- **Automatic state synchronization**: All components using the same remote hooks share state automatically
- **Performance**: Event-specific subscriptions prevent unnecessary re-renders across modules
- **Encapsulation**: Remote modules control their own state, expose clean APIs
- **Scalability**: Multiple remote hooks can share the same underlying store

**State Synchronization Example:**
When `ThemeToggle` updates the theme, `LanguageSelector` won't re-render (different events), but any other component using the preferences hook will get the updated theme instantly.

*Remote hooks documentation: [Scalprum useRemoteHook](https://github.com/scalprum/scaffolding/blob/main/packages/react-core/docs/use-remote-hook.md)*

### When to Use vs Global State

| Use Case | Shared State | Global State (Redux/Zustand) |
|----------|--------------|------------------------------|
| Theme preferences | ✅ Perfect fit | ❌ Overkill |
| Selected table rows | ✅ Good choice | ❌ Too simple |
| Shopping cart with validation | ❌ Too limited | ✅ Better choice |
| Full application auth state | ❌ Wrong scope | ✅ Correct choice |
| Module-specific UI toggles | ✅ Good for sharing | ❌ Local state better |

## Best Practices

1. **Use const assertions:** `events: ['UPDATE_THEME'] as const` for type safety
2. **Events with payloads:** Use generic events like `UPDATE_FIELD` with payloads vs many specific events
3. **Keep state flat:** Avoid deep nesting for small shared state between modules
4. **One concern per store:** Keep each store focused on a single responsibility or related functionality
5. **Small state only:** 5-10 properties maximum per store (this is for module communication, not app state)
6. **Always return new objects:** Use spread operator in `onEventChange` for immutability

## Test Coverage

All features are tested in:
- `packages/utils/src/sharedStore/createSharedStore.test.ts`
- `packages/utils/src/sharedStore/useGetState.test.ts`
- `packages/utils/src/sharedStore/useSubscribeStore.test.ts`
- `packages/utils/src/sharedStore/renderOptimization.test.tsx`
