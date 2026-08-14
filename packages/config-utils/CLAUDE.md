# Config Utils Package

## Overview

Webpack configuration utilities for Red Hat Cloud Services applications. Provides module federation, development proxy, PatternFly integration, and helper functions.

**Package**: `@redhat-cloud-services/frontend-components-config-utilities`  
**Used By**: `@redhat-cloud-services/frontend-components-config`

## Quick Reference

```typescript
import { 
  federatedModules,
  proxy,
  generatePFSharedAssetsList,
  searchIgnoredStyles,
  cookieTransform,
  validateFrontendCrd,
  fecLogger,
  jsVarName
} from '@redhat-cloud-services/frontend-components-config-utilities';
```

## Core Functions

### federatedModules

Configure webpack module federation for micro-frontends.

```typescript
const moduleConfig = federatedModules({
  root: __dirname,                    // Required: Root directory
  exposes: {                          // Components to expose
    './RootApp': './src/AppEntry',
    './Component': './src/Component'
  },
  shared: [                           // Custom shared modules
    { 'react': { singleton: true } }
  ],
  exclude: ['lodash'],                // Exclude from shared
  moduleName: 'myApp'                 // Federation module name
});
```

**Returns**: Webpack ModuleFederationPlugin configuration

**See**: [Core Functions Doc](./doc/core-functions.md#federatedmodules)

### proxy

Development server proxy configuration.

```typescript
const proxyConfig = proxy({
  env: 'stage-stable',       // Environment (stage-stable, prod-stable)
  useProxy: true,            // Enable proxy
  publicPath: '/apps/myapp', // Public path for assets
  localChrome: '/path/to/chrome/build/',
  routes: {                  // Custom routes
    '/api': { host: 'http://localhost:8080' }
  }
});
```

**Returns**: Webpack proxy configuration object

**See**: [Core Functions Doc](./doc/core-functions.md#proxy)

### generatePFSharedAssetsList

Discover PatternFly dynamic modules for webpack federation.

```typescript
const pfModules = generatePFSharedAssetsList();
// Returns: ['@patternfly/react-core', '@patternfly/react-table', ...]

// Use in module federation
const modules = federatedModules({
  root: __dirname,
  shared: pfModules
});
```

**Returns**: Array of PatternFly module names

**See**: [Utility Functions Doc](./doc/utility-functions.md#generatepfsharedassets)

### searchIgnoredStyles

PatternFly CSS webpack aliases to prevent bundling.

```typescript
const aliases = searchIgnoredStyles();

// Webpack config
module.exports = {
  resolve: {
    alias: aliases
  }
};
```

**Returns**: Object with PatternFly CSS aliases

**See**: [Utility Functions Doc](./doc/utility-functions.md#searchignoredstyles)

## Helper Utilities

### cookieTransform

Transform authentication cookies for proxy requests.

```typescript
const transformedCookie = cookieTransform(cookieString);
```

**See**: [Core Functions Doc](./doc/core-functions.md#cookietransform)

### validateFrontendCrd

Validate Frontend Custom Resource Definition YAML.

```typescript
const isValid = validateFrontendCrd(yamlContent);
```

**See**: [Core Functions Doc](./doc/core-functions.md#validatefrontendcrd)

### fecLogger

Colored logging utility for build/development output.

```typescript
import { fecLogger } from '@redhat-cloud-services/frontend-components-config-utilities';

fecLogger.info('Build starting...');
fecLogger.success('Build complete!');
fecLogger.warn('Deprecated API usage');
fecLogger.error('Build failed');
```

**See**: [Utility Functions Doc](./doc/utility-functions.md#feclogger)

### jsVarName

Convert strings to valid JavaScript variable names.

```typescript
const varName = jsVarName('my-app-name');
// Returns: 'myAppName'
```

**See**: [Utility Functions Doc](./doc/utility-functions.md#jsvarname)

## Standalone Development

Services for offline/standalone development.

```typescript
const {
  rbac,
  backofficeProxy,
  defaultServices,
  chrome,
  entitlements,
  landing,
  servicesConfig
} = require('@redhat-cloud-services/frontend-components-config-utilities/standalone');

// Use in config
const { config } = require('@redhat-cloud-services/frontend-components-config');

config({
  reposDir: 'repos',
  standalone: {
    rbac,
    backofficeProxy,
    ...defaultServices
  }
});
```

**See**: [Advanced Features Doc](./doc/advanced-features.md)

## Module Federation Patterns

### Basic Setup

```typescript
import { federatedModules } from '@redhat-cloud-services/frontend-components-config-utilities';

const { config: webpackConfig } = require('@redhat-cloud-services/frontend-components-config')({
  rootFolder: resolve(__dirname, '../'),
  ...federatedModules({
    root: __dirname,
    exposes: {
      './RootApp': './src/AppEntry'
    }
  })
});
```

### With PatternFly Shared Modules

```typescript
import { 
  federatedModules,
  generatePFSharedAssetsList 
} from '@redhat-cloud-services/frontend-components-config-utilities';

const pfModules = generatePFSharedAssetsList();

federatedModules({
  root: __dirname,
  exposes: { './RootApp': './src/AppEntry' },
  shared: [
    ...pfModules,
    { 'react': { singleton: true } },
    { 'react-dom': { singleton: true } }
  ]
});
```

### Custom Shared Dependencies

```typescript
federatedModules({
  root: __dirname,
  exposes: { './RootApp': './src/AppEntry' },
  shared: [
    {
      'react-router-dom': {
        singleton: true,
        requiredVersion: '^6.0.0'
      }
    }
  ],
  exclude: ['heavy-library']  // Don't share
});
```

## Proxy Development Patterns

### Local API + Remote Environment

```typescript
proxy({
  env: 'stage-stable',
  useProxy: true,
  routes: {
    '/api/myservice': { 
      host: 'http://localhost:8080',
      changeOrigin: true
    }
  }
});
```

### Multiple Service Routing

```typescript
proxy({
  env: 'stage-stable',
  useProxy: true,
  routes: {
    '/api/service1': { host: 'http://localhost:8080' },
    '/api/service2': { host: 'http://localhost:8081' },
    '/config': { host: 'http://localhost:8889' }
  }
});
```

### Custom Chrome Build

```typescript
proxy({
  env: 'stage-stable',
  useProxy: true,
  localChrome: process.env.INSIGHTS_CHROME,  // Must end with /
  proxyVerbose: true
});
```

## PatternFly Integration

### Prevent CSS Bundling

```typescript
import { searchIgnoredStyles } from '@redhat-cloud-services/frontend-components-config-utilities';

// Webpack config
module.exports = {
  resolve: {
    alias: {
      ...searchIgnoredStyles(),
      // Your aliases
    }
  }
};
```

**Why**: PatternFly CSS hosted by chrome, no need to bundle

### Dynamic Module Discovery

```typescript
import { generatePFSharedAssetsList } from '@redhat-cloud-services/frontend-components-config-utilities';

const pfModules = generatePFSharedAssetsList();
// Automatically discovers all PF packages in node_modules
```

**Benefits**:
- Auto-detects PatternFly packages
- Configures module federation sharing
- Version compatibility checking
- Reduces bundle duplication

## Common Use Cases

### Micro-Frontend Setup

```typescript
// app1/webpack.config.js
const { federatedModules } = require('@redhat-cloud-services/frontend-components-config-utilities');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      ...federatedModules({
        root: __dirname,
        exposes: {
          './UserProfile': './src/components/UserProfile'
        }
      })
    })
  ]
};

// app2/src/RemoteComponent.tsx
const UserProfile = React.lazy(() => import('app1/UserProfile'));
```

### Development with Remote APIs

```typescript
const { proxy } = require('@redhat-cloud-services/frontend-components-config-utilities');

proxy({
  env: 'stage-stable',
  useProxy: true,
  routes: {
    '/api/rbac': { host: 'http://localhost:8080' },
    '/api/entitlements': { host: 'http://localhost:8081' }
  }
});
```

### Standalone Offline Development

```typescript
const { defaultServices } = require('@redhat-cloud-services/frontend-components-config-utilities/standalone');

config({
  reposDir: 'repos',
  standalone: {
    ...defaultServices,
    // Clones chrome, config, entitlements, landing
    // Starts Keycloak on :4001
  }
});
```

## Testing

All functions have comprehensive unit tests:

```bash
# Run tests
npx nx run @redhat-cloud-services/frontend-components-config-utilities:test:unit

# With coverage
npm run test:coverage
```

Test files validate all documented examples.

## Common Issues

### Module Federation Not Working
**Check**:
- `exposes` paths are correct
- Module name unique across federation
- Shared dependencies configured
- Webpack 5 in use

### Proxy Not Routing
**Check**:
- `/etc/hosts` patched
- Routes defined correctly
- localChrome path ends with `/`
- Proxy enabled (`useProxy: true`)

### PatternFly Bundled in Output
**Solution**: Add `searchIgnoredStyles()` to webpack aliases

### Standalone Services Not Starting
**Check**:
- Docker/Podman running
- Ports not in use
- Repos directory writable
- Network access for git clone

## Performance Tips

1. **Module Federation**: Share common deps (React, PF) to reduce duplication
2. **CSS Aliases**: Use `searchIgnoredStyles()` to avoid bundling PF CSS
3. **Dynamic Discovery**: Use `generatePFSharedAssetsList()` instead of manual lists
4. **Proxy Caching**: Enable webpack cache for faster rebuilds
5. **Selective Sharing**: Only share what's needed, exclude heavy libraries

## Documentation

**Comprehensive docs in [doc/ directory](./doc/)**:
- [Core Functions](./doc/core-functions.md) - federatedModules, proxy, validation
- [Utility Functions](./doc/utility-functions.md) - Helpers and tools
- [Advanced Features](./doc/advanced-features.md) - FEO, standalone mode
- [README](./doc/README.md) - Documentation overview

**Package README**: [./README.md](./README.md)

## Development Workflow

### Adding New Utility

1. Create function in `src/lib/`
2. Export from `src/index.ts`
3. Add comprehensive tests
4. Document in appropriate `doc/*.md` file
5. Update doc/README.md if new category
6. Reference test file in docs

### Updating Existing Function

1. Update implementation
2. Update/add tests
3. Update documentation
4. Verify examples still work
5. Update version if breaking change

## Architecture Notes

### Why Separate from Config?

- **Utilities**: Pure functions, testable
- **Config**: Webpack-specific, uses utilities
- **Reusability**: Utils can be used independently
- **Testing**: Easier to test utilities in isolation

### Module Federation Design

- Auto-discovery of PF modules
- Singleton patterns for frameworks
- Version compatibility checks
- Shared dependency optimization

### Proxy Architecture

- Express middleware integration
- Environment-based routing
- Local/remote hybrid development
- Cookie transformation for auth

## Contributing

When contributing to config-utils:

1. **Tests Required**: All functions must have tests
2. **Documentation**: Update relevant doc/*.md files
3. **Examples**: Provide working examples
4. **Backwards Compat**: Avoid breaking changes
5. **Performance**: Consider webpack build time impact

## Related Packages

- [config](../config/) - Uses these utilities
- [components](../components/) - Benefits from module federation
- [chrome](../chrome/) - Integrated via proxy
