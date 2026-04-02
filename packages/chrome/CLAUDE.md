# Chrome Package

## Overview

Public interface for insights-chrome integration. Provides React Context, hooks, and utilities for accessing chrome shared data and functions across all console.redhat.com applications.

**Package**: `@redhat-cloud-services/chrome`  
**Dependencies**: `@scalprum/react-core`, `react-router-dom`

## Architecture

```text
ChromeProvider (Context Provider)
├── chromeState (State Management)
│   ├── User Identity
│   ├── Last Visited Pages
│   ├── Favorite Pages
│   └── Visited Bundles
├── Custom Hooks
│   ├── useLastVisited
│   ├── useFavoritePages
│   └── useVisitedBundles
└── ChromeContext (React Context)
```

## Quick Start

### 1. Wrap Your App

```tsx
import { ChromeProvider } from '@redhat-cloud-services/chrome';

const App = () => (
  <ChromeProvider>
    <YourApplication />
  </ChromeProvider>
);
```

### 2. Use Chrome Hooks

```tsx
import { 
  useLastVisited, 
  useFavoritePages,
  useVisitedBundles 
} from '@redhat-cloud-services/chrome';

function MyComponent() {
  const { lastVisited } = useLastVisited();
  const { favoritePages, favoritePage } = useFavoritePages();
  const { visitedBundles } = useVisitedBundles();
  
  return <div>...</div>;
}
```

## ChromeProvider

Root provider that manages chrome state and syncs with backend APIs.

### Features

- **User Identity**: Fetches from `/api/chrome-service/v1/user/identity`
- **Last Visited**: Tracks recent pages, syncs to backend and localStorage
- **Favorite Pages**: Manages user favorites via API
- **Visited Bundles**: Tracks bundle navigation history

### State Management

Uses pub/sub pattern with `chromeState`:

```typescript
interface ChromeState {
  lastVisitedPages: LastVisitedPage[];
  favoritePages: FavoritePage[];
  visitedBundles: Record<string, boolean>;
  identity?: UserIdentity;
  initialized: boolean;
}
```

### Automatic Behaviors

1. **Identity Loading**: Fetches user identity on mount
2. **Last Visited Sync**: 
   - Saves to localStorage on page title change
   - Uploads to backend every 3 minutes
   - Uploads on tab inactivity (20 seconds)
3. **Page Title Observer**: Watches `<title>` changes via MutationObserver
4. **Visibility Change**: Detects tab inactive/active states

## ChromeContext

React Context for accessing chrome state directly.

```tsx
import ChromeContext from '@redhat-cloud-services/chrome/ChromeContext';
import { useContext } from 'react';

function MyComponent() {
  const chrome = useContext(ChromeContext);
  
  // Methods
  chrome.setLastVisited(pages);
  chrome.setFavoritePages(pages);
  chrome.setIdentity(identity);
  chrome.setVisitedBundles(bundles);
  chrome.subscribe(event, callback);
  chrome.unsubscribe(id, event);
  chrome.getState();
  
  return <div>...</div>;
}
```

**Note**: Prefer using custom hooks over direct context access.

## useLastVisited Hook

Track and retrieve user's recently visited pages.

```tsx
import { useLastVisited } from '@redhat-cloud-services/chrome';

function RecentPages() {
  const { lastVisited, initialized } = useLastVisited();
  
  if (!initialized) {
    return <Spinner />;
  }
  
  return (
    <ul>
      {lastVisited.map(page => (
        <li key={page.pathname}>
          <a href={page.pathname}>{page.title}</a>
          <span>{page.bundle}</span>
        </li>
      ))}
    </ul>
  );
}
```

### Return Type

```typescript
{
  lastVisited: LastVisitedPage[];  // Max 10 pages
  initialized: boolean;
}

interface LastVisitedPage {
  pathname: string;
  title: string;
  bundle?: string;
}
```

### Data Sources

1. Backend API (`/api/chrome-service/v1/last-visited`)
2. localStorage (`chrome:lastVisited`)
3. Merged and deduplicated (max 10 items)

### Auto-Tracking

Pages automatically added when:
- `<title>` element changes (MutationObserver)
- Pathname changes (react-router)
- Title is different from previous

### Upload Triggers

Data uploaded to backend when:
- Every 3 minutes (interval)
- Tab becomes inactive for 20 seconds
- Component unmounts

## useFavoritePages Hook

Manage user's favorite pages with optimistic updates.

```tsx
import { useFavoritePages } from '@redhat-cloud-services/chrome';

function FavoritesMenu() {
  const { 
    favoritePages, 
    favoritePage, 
    unfavoritePage,
    initialized 
  } = useFavoritePages();
  
  const handleToggle = async (pathname: string, isFavorite: boolean) => {
    if (isFavorite) {
      await unfavoritePage(pathname);
    } else {
      await favoritePage(pathname);
    }
  };
  
  return (
    <div>
      {favoritePages.map(page => (
        <FavoriteItem 
          key={page.pathname}
          page={page}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
}
```

### Return Type

```typescript
{
  favoritePages: FavoritePage[];
  favoritePage: (pathname: string) => Promise<FavoritePage[]>;
  unfavoritePage: (pathname: string) => Promise<FavoritePage[]>;
  initialized: boolean;
}

interface FavoritePage {
  pathname: string;
  favorite: boolean;
}
```

### API Endpoint

- POST `/api/chrome-service/v1/favorite-pages`
- Body: `{ pathname: string, favorite: boolean }`
- Returns: Updated array of all favorite pages

### Optimistic Updates

1. Updates local state immediately
2. Makes API call
3. On success: Updates with API response
4. On error: Reverts to previous state

### Error Handling

- Logs errors to console
- Automatically reverts state on API failure
- No user-facing errors (silent fallback)

## useVisitedBundles Hook

Track which platform bundles (apps) user has visited.

```tsx
import { useVisitedBundles } from '@redhat-cloud-services/chrome';

function BundleNav() {
  const { visitedBundles, initialized } = useVisitedBundles();
  
  const hasVisited = (bundle: string) => visitedBundles[bundle];
  
  return (
    <nav>
      <NavItem 
        visited={hasVisited('insights')}
        label="Red Hat Insights"
      />
      <NavItem 
        visited={hasVisited('ansible')}
        label="Ansible Automation"
      />
    </nav>
  );
}
```

### Return Type

```typescript
{
  visitedBundles: Record<string, boolean>;
  initialized: boolean;
}
```

### Bundle Tracking

Bundles are tracked via Scalprum integration:
- Bundle name from `scalprum.api.chrome.getBundleData().bundleTitle`
- Stored in chrome state
- Persisted across sessions

## State Synchronization

### Subscription Pattern

Components auto-update via pub/sub:

```typescript
enum UpdateEvents {
  lastVisitedPages = 'lastVisitedPages',
  favoritePages = 'favoritePages',
  visitedBundles = 'visitedBundles',
  identity = 'identity',
  all = 'all'
}
```

Hooks subscribe to relevant events and force re-render on changes.

### Subscribe/Unsubscribe

```tsx
import ChromeContext from '@redhat-cloud-services/chrome/ChromeContext';

function CustomComponent() {
  const chrome = useContext(ChromeContext);
  
  useEffect(() => {
    const id = chrome.subscribe(UpdateEvents.lastVisitedPages, () => {
      console.log('Last visited updated');
    });
    
    return () => chrome.unsubscribe(id, UpdateEvents.lastVisitedPages);
  }, []);
}
```

## API Integration

### Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/chrome-service/v1/user/identity` | GET | User identity |
| `/api/chrome-service/v1/last-visited` | GET/POST | Last visited pages |
| `/api/chrome-service/v1/favorite-pages` | POST | Favorite pages |

### Fetch Utilities

```typescript
import { get, post } from '@redhat-cloud-services/chrome/utils/fetch';

// Generic GET
const data = await get<ResponseType>('/api/endpoint');

// Generic POST
const result = await post<ResponseType, BodyType>('/api/endpoint', body);
```

### Error Handling

- All API calls wrapped in try/catch
- Errors logged to console
- Graceful fallbacks (localStorage, previous state)
- No blocking errors for user experience

## localStorage Integration

### Keys

- `chrome:lastVisited` - Last visited pages cache

### Usage Pattern

1. Read from localStorage on mount (fallback)
2. Fetch from API (source of truth)
3. Merge and deduplicate
4. Save merged result to localStorage
5. Update localStorage on every change

### Data Format

```json
{
  "chrome:lastVisited": [
    {
      "pathname": "/insights/dashboard",
      "title": "Dashboard",
      "bundle": "Red Hat Insights"
    }
  ]
}
```

## Performance Considerations

### Optimization Strategies

1. **Ref-based State**: Uses `useRef` to avoid re-renders
2. **Selective Subscriptions**: Hooks only subscribe to needed events
3. **Debounced Uploads**: 3-minute batch interval for API calls
4. **Optimistic Updates**: Immediate UI feedback
5. **MutationObserver**: Efficient title change detection
6. **Cleanup**: Proper timer/listener cleanup on unmount

### Upload Intervals

- **Periodic**: Every 3 minutes
- **Inactivity**: 20 seconds after tab hidden
- **Unmount**: On component cleanup

## Common Patterns

### Conditional Rendering Based on Initialization

```tsx
function MyComponent() {
  const { lastVisited, initialized } = useLastVisited();
  
  if (!initialized) {
    return <Spinner />;
  }
  
  return <PageList pages={lastVisited} />;
}
```

### Combining Multiple Hooks

```tsx
function UserDashboard() {
  const { lastVisited } = useLastVisited();
  const { favoritePages } = useFavoritePages();
  const { visitedBundles } = useVisitedBundles();
  
  return (
    <Dashboard
      recent={lastVisited}
      favorites={favoritePages}
      bundles={Object.keys(visitedBundles)}
    />
  );
}
```

### Custom Chrome State Access

```tsx
import ChromeContext from '@redhat-cloud-services/chrome/ChromeContext';

function AdvancedComponent() {
  const chrome = useContext(ChromeContext);
  const [state, setState] = useState(chrome.getState());
  
  useEffect(() => {
    const id = chrome.subscribe(UpdateEvents.all, () => {
      setState(chrome.getState());
    });
    return () => chrome.unsubscribe(id, UpdateEvents.all);
  }, []);
  
  return <div>{JSON.stringify(state)}</div>;
}
```

## Testing

### Unit Tests

Tests use standard React Testing Library patterns:

```tsx
import { render } from '@testing-library/react';
import { ChromeProvider } from '@redhat-cloud-services/chrome';

test('provides chrome context', () => {
  const { getByText } = render(
    <ChromeProvider>
      <TestComponent />
    </ChromeProvider>
  );
  // assertions
});
```

### Mocking Chrome Context

```tsx
import ChromeContext from '@redhat-cloud-services/chrome/ChromeContext';

const mockChromeState = {
  getState: () => ({
    lastVisitedPages: [],
    favoritePages: [],
    visitedBundles: {},
    initialized: true
  }),
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
  // ... other methods
};

<ChromeContext.Provider value={mockChromeState}>
  <YourComponent />
</ChromeContext.Provider>
```

## Common Issues

### Hook Called Outside Provider
**Error**: "Cannot read property 'subscribe' of undefined"  
**Solution**: Ensure component is wrapped in `<ChromeProvider>`

### Last Visited Not Updating
**Check**:
- `<title>` element exists in document
- Title is actually changing (MutationObserver target)
- Component mounted when title changes

### Favorite Not Persisting
**Check**:
- API endpoint accessible
- Network request succeeds
- Error messages in console

### State Not Syncing
**Check**:
- Subscription properly set up in useEffect
- Cleanup function unsubscribes
- Event type matches (lastVisitedPages vs favoritePages)

## Architecture Notes

### Why MutationObserver?

- Detects title changes without polling
- Works across any routing solution
- Minimal performance impact
- Automatic cleanup

### Why Optimistic Updates?

- Immediate UI feedback
- Better UX during network latency
- Automatic rollback on error
- Reduces perceived loading time

### Why localStorage + API?

- Fast initial load (localStorage cache)
- Persistence across sessions
- Sync across devices (API)
- Offline capability (localStorage fallback)

## Documentation

Currently limited - this CLAUDE.md serves as primary documentation until formal docs are created.

## Running Tests

```bash
# Unit tests
npx nx run @redhat-cloud-services/chrome:test:unit

# Build
npx nx run @redhat-cloud-services/chrome:build
```

## Future Enhancements

Consider documenting when implemented:
- User preferences/settings
- Theme management
- Notification state
- Global search integration
- Cross-app state sharing
