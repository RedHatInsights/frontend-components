# Components Package

## Overview

The largest package in the monorepo with 50+ React components for Red Hat Cloud Services. Provides shared UI components used across console.redhat.com applications.

**Package**: `@redhat-cloud-services/frontend-components`  
**Dependencies**: Requires `@redhat-cloud-services/frontend-components-utilities`

## Key Components

- **ConditionalFilter** - Advanced filtering with TextFilter, CheckboxFilter, GroupFilter
- **Filters** - Primary/Active filters with chips
- **Battery** - Security/health status indicators
- **BulkSelect** - Mass selection UI
- **Breadcrumbs** - Navigation breadcrumbs
- **DateFormat** - Consistent date formatting
- **EmptyTable/EmptyState** - No data states
- **ErrorBoundary/ErrorState** - Error handling UI
- **Ansible** - Ansible-specific components
- **Inventory** - Inventory integration components
- **Pagination** - Table pagination controls
- **TableToolbar** - Table filtering and actions
- **InsightsLabel/InsightsLink** - Platform-specific UI elements

## Development Workflow

### Local Development

Use the demo sandbox to develop components:

```bash
# Start sandbox (links to all packages)
npm run serve:demo
# Open http://localhost:4200/

# Demo source (DO NOT commit changes)
# examples/demo/src/app/app.tsx
```

### Testing Components

**Preferred**: Cypress component testing (real browser)

```bash
# Run all component tests
npx nx run @redhat-cloud-services/frontend-components:test:component

# Watch mode for development
npx nx run @redhat-cloud-services/frontend-components:test:component --watch

# Test specific component
# Create test: packages/components/cypress/<ComponentName>/<ComponentName>.cy.tsx
```

**Component Test Best Practices**:
- Use data-testid selectors, not CSS classes
- Test user interactions, not implementation
- Verify accessibility (ARIA labels, keyboard nav)
- Avoid arbitrary timeouts - use proper waits
- Test loading/error states

**Unit Tests** (for hooks/utilities only):

```bash
npx nx run @redhat-cloud-services/frontend-components:test:unit
```

### Linking with Another App

Test your local changes in another application:

```bash
# In frontend-components root
npm i && npm run build
cd dist/@redhat-cloud-services/frontend-components
npm link

# In target app (e.g., insights-inventory-frontend)
npm link @redhat-cloud-services/frontend-components

# Verify link
ls -l node_modules/@redhat-cloud-services/frontend-components

# In target app's fec.config.js, add:
resolve: {
  modules: ['...', resolve(__dirname, 'node_modules'), 'node_modules'],
}

# Build and run
npm run build
npm run start:proxy
```

## Import Optimization (Critical!)

### Direct Imports (Recommended)

**Always** use direct imports for tree-shaking:

```tsx
// ✅ Good - only imports what you need
import TableToolbar from '@redhat-cloud-services/frontend-components/TableToolbar';
import { ConditionalFilter } from '@redhat-cloud-services/frontend-components/ConditionalFilter';

// ❌ Bad - imports entire library
import { TableToolbar } from '@redhat-cloud-services/frontend-components';
```

### Babel Plugin Alternative

Use `babel-plugin-transform-imports` to auto-transform imports:

```js
// babel.config.js
const FECMapper = {
  SkeletonSize: 'Skeleton',
  PageHeaderTitle: 'PageHeader'
};

module.exports = {
  plugins: [
    [
      'transform-imports',
      {
        '@redhat-cloud-services/frontend-components': {
          transform: (importName) =>
            `@redhat-cloud-services/frontend-components/${FECMapper[importName] || importName}`,
          preventFullImport: false,
          skipDefaultConversion: true
        }
      },
      'frontend-components'
    ]
  ]
};
```

## Migration Guide (v2 → v3)

### Import Path Changes

```tsx
// v2
import { Ansible } from '@redhat-cloud-services/frontend-components/components/cjs/Ansible';

// v3
import Ansible from '@redhat-cloud-services/frontend-components/Ansible';
// OR
import { Ansible } from '@redhat-cloud-services/frontend-components/Ansible';
```

### CSS No Longer Required

Components auto-import their styles:

```diff
-@import '~@redhat-cloud-services/frontend-components/index.css';
```

### Sub-component Imports

Import sub-components from parent module only:

```tsx
// ✅ OK - single level import
import { TextFilter } from '@redhat-cloud-services/frontend-components/ConditionalFilter';

// ❌ Wrong - breaks module resolution
import TextFilter from '@redhat-cloud-services/frontend-components/ConditionalFilter/TextFilter';
```

## Component Structure

```text
packages/components/src/
├── <ComponentName>/
│   ├── <ComponentName>.tsx       # Main component
│   ├── <ComponentName>.test.tsx  # Unit tests (if needed)
│   ├── <ComponentName>.scss      # Component styles
│   ├── index.ts                  # Export
│   └── types.ts                  # TypeScript types
├── cypress/
│   └── <ComponentName>/
│       └── <ComponentName>.cy.tsx # Component tests
└── index.ts                      # Package exports
```

## Component Development Checklist

- [ ] Use PatternFly components as base when possible
- [ ] TypeScript types for all props (no `any`)
- [ ] Cypress component test with user interactions
- [ ] Accessibility: ARIA labels, keyboard navigation, semantic HTML
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Loading and error states
- [ ] Direct import path works
- [ ] Styles auto-import with component
- [ ] Documentation in component JSDoc
- [ ] Export from package index.ts

## Common Patterns

### Conditional Rendering
```tsx
import { EmptyState } from '@redhat-cloud-services/frontend-components/EmptyState';
import { ErrorState } from '@redhat-cloud-services/frontend-components/ErrorState';

{isLoading && <Spinner />}
{error && <ErrorState error={error} />}
{!data?.length && <EmptyState />}
{data && <YourComponent data={data} />}
```

### Filters with Chips
```tsx
import { ConditionalFilter } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { FilterChips } from '@redhat-cloud-services/frontend-components/FilterChips';

<ConditionalFilter items={filterConfig} />
<FilterChips onDelete={handleDelete} chips={activeFilters} />
```

### Error Boundaries
```tsx
import { ErrorBoundary } from '@redhat-cloud-services/frontend-components/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

## Styling Guidelines

- Use PatternFly tokens for colors, spacing, typography
- Component-specific SCSS in component directory
- Import styles in component file (auto-bundled)
- Avoid `!important` overrides
- Use BEM naming for custom classes
- Responsive breakpoints: mobile-first approach

## Accessibility Requirements

- All interactive elements keyboard accessible
- Proper ARIA roles and labels
- Focus management for modals/drawers
- Color contrast WCAG 2.1 AA (use PF tokens)
- Screen reader tested
- No keyboard traps

## Performance Considerations

- Use React.memo for expensive renders
- Virtualization for large lists (react-window)
- Code split heavy components
- Lazy load when appropriate
- Optimize re-renders (useCallback, useMemo)

## Common Issues

### Import Size Too Large
**Problem**: Bundle size increases significantly  
**Solution**: Use direct imports or babel plugin

### CSS Conflicts
**Problem**: Styles conflict with app styles  
**Solution**: Use PatternFly tokens, avoid global selectors

### Component Not Rendering
**Problem**: Component doesn't appear  
**Solution**: Check dependencies installed, styles imported (should be automatic in v3)

### Type Errors
**Problem**: TypeScript errors with component props  
**Solution**: Check @redhat-cloud-services/types package version

## Documentation

See package README and component-specific docs:
- [Main README](./README.md)
- [Components Doc Directory](../../docs/)
- Individual component JSDoc comments

## Testing

```bash
# Component tests (Cypress)
npx nx run @redhat-cloud-services/frontend-components:test:component

# Unit tests (Jest)
npx nx run @redhat-cloud-services/frontend-components:test:unit

# Lint
npx nx run @redhat-cloud-services/frontend-components:lint

# Build
npx nx run @redhat-cloud-services/frontend-components:build
```
