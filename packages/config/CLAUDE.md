# Config Package

## Overview

Webpack 5 configuration for Red Hat Cloud Services applications. Provides module federation, development proxy, and build tooling for console.redhat.com apps.

**Package**: `@redhat-cloud-services/frontend-components-config`  
**Critical**: Read full [README](./README.md) (529 lines) for comprehensive details

## Quick Start

```typescript
const { config } = require('@redhat-cloud-services/frontend-components-config');

const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  useProxy: true,
  env: 'stage-stable',
  appUrl: '/apps/my-app'
});

module.exports = {
  ...webpackConfig,
  plugins
};
```

## Development Proxy Setup

### Basic Proxy

Drop-in replacement for insights-proxy:

```javascript
const { config } = require('@redhat-cloud-services/frontend-components-config');

const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  useProxy: true,
  env: 'stage-stable',  // or 'prod-stable'
});
```

### Environment Options

- `env: 'stage-stable'` → stage.console.redhat.com (uses QA branch)
- `env: 'prod-stable'` → console.redhat.com
- `useCloud: true` → Legacy cloud.redhat.com paths (fallback)
- `target: 'https://...'` → Custom target override

### Local Chrome Development

Run with local insights-chrome build:

```javascript
config({
  useProxy: true,
  localChrome: process.env.INSIGHTS_CHROME,  // '/path/to/chrome/build/'
  proxyVerbose: true  // Debug proxy behavior
});
```

```bash
# Set environment variable (path MUST end with /)
export INSIGHTS_CHROME=/Users/yourname/insights-chrome/build/
npm run start:proxy
```

### Custom Routes

#### Inline Routes

```javascript
config({
  useProxy: true,
  routes: {
    '/config/main.yml': { host: 'http://127.0.0.1:8889' },
    '/api/custom': { host: 'http://localhost:8000' }
  }
});
```

#### Routes from File

```javascript
// fec.config.js
config({
  useProxy: true,
  routesPath: process.env.CONFIG_PATH
});
```

```bash
# spandx.config.js
module.exports = {
  routes: {
    '/api': { host: 'http://localhost:8080' },
    '/config': { host: 'http://127.0.0.1:8889' }
  }
};
```

```bash
CONFIG_PATH=/path/to/spandx.config.js npm run start:proxy
```

### Custom Proxy Configuration

Add custom webpack proxy config:

```javascript
config({
  customProxy: [
    {
      context: ['/api'],
      target: 'https://qa.cloud.redhat.com',
      secure: false,
      changeOrigin: true
    }
  ]
});
```

### Express Middleware Registry

Add custom middleware before webpack:

```javascript
const express = require('express');

config({
  registry: [
    // Override specific files
    ({ app }) => app.get('/config/main.yml', (_req, res) => 
      res.send('custom config')
    ),
    
    // Serve entire directory
    ({ app }) => {
      const staticConfig = express.static('pathToLocalCloudServicesConfig');
      app.use('/config', staticConfig);
    }
  ]
});
```

### Keycloak URI Override

Change SSO endpoint (useful for ephemeral envs):

```javascript
config({
  useProxy: true,
  keycloakUri: 'https://sso.qa.redhat.com'
});
```

### PROD Without VPN

Access PROD without Red Hat VPN using bounce:

```javascript
config({
  env: 'prod-stable',
  useAgent: false,      // Don't use agent for PROD
  bounceProd: true      // Bounce non-GET requests via server
});
```

**Note**: Removes all headers except cookie/body for Akamai compatibility

## Running Multiple Local Apps

Proxy one app and run others on different ports:

```bash
# Terminal 1: Start Advisor on port 8002
cd insights-advisor-frontend
npm run start

# Terminal 2: Start Compliance on port 8003
cd insights-compliance-frontend  
npm run start

# Terminal 3: Start Inventory with proxy (main app)
cd insights-inventory-frontend
LOCAL_APPS=advisor:8002,compliance:8003 npm run start:proxy

# Access at https://stage.foo.redhat.com:1337
```

**Format**: `LOCAL_APPS=app1:port1[~protocol],app2:port2`

## Standalone Mode (Offline Development)

Run apps from localhost without network access.

### Simple Standalone

Uses 4 default services:
- insights-chrome (with local Keycloak on :4001)
- entitlements-config (all entitlements granted)
- landing-page
- cloud-services-config

```javascript
config({
  reposDir: 'repos',  // Directory to clone repos into
  standalone: true
});
```

**Users**: admin/admin and user/user

### Advanced Standalone

```javascript
const {
  rbac,
  backofficeProxy,
  defaultServices
} = require('@redhat-cloud-services/frontend-components-config-utilities/standalone');

config({
  standalone: {
    rbac,
    backofficeProxy,
    ...defaultServices
  }
});
```

### Custom Services

```javascript
config({
  standalone: {
    servicesConfig: {
      assets: {
        config: 'https://github.com/redhatinsights/cloud-services-config#prod-stable'
      },
      services: {
        keycloak: {
          args: ['...docker args'],
          startMessage: 'Started',
          dependsOn: ['projectName_serviceName']
        }
      },
      register({ app, server, compiler, config }) {
        // Express middleware
        const staticConfig = express.static(config.servicesConfig.assets.config);
        app.use('/config', staticConfig);
      },
      context: ['/auth'],
      target: 'http://localhost:4001'
    }
  }
});
```

### Customize Default Services

```javascript
const { defaultServices } = require('@redhat-cloud-services/frontend-components-config-utilities/standalone');

defaultServices.chrome.path = '/path/to/my/insights-chrome';

config({
  standalone: defaultServices
});
```

## FEC Node Scripts

Executable scripts available after installing this package.

### Patch /etc/hosts

**Required** for first-time setup (may need sudo):

```bash
npx fec patch-etc-hosts
```

Maps localhost to [env].foo.redhat.com

### Dev Proxy (Containerized)

Alternative to webpack-dev-server using Caddy container:

```bash
# Default ports (proxy: 1337, static: 8003)
npx fec dev-proxy

# Custom configuration
npx fec dev-proxy --port 3000 --clouddotEnv stage --staticPort 9000
```

**Requirements**:
- Docker or Podman installed
- Valid fec.config.js
- Network access for stage environments

**What it does**:
1. Pulls development proxy container
2. Starts webpack in watch mode
3. Serves static assets via http-server
4. Configures routing from fec.config.js
5. Starts local Chrome UI (disable with `SPAFallback: false`)

**Access**: `https://[env].foo.redhat.com:[port]`

**Limitation**: Doesn't work in DinD environments

### Static Build Server

Run webpack build and serve output (for federated module development):

```bash
npx fec static
```

**Use case**: Proxy remote containers to another app

#### Example: Proxy Inventory Table to Compliance

```javascript
// In inventory-frontend package.json
{
  "scripts": {
    "start:federated": "fec static"
  }
}

// In compliance-frontend fec.config.js
config({
  useProxy: true,
  routes: {
    '/apps/inventory': { host: 'http://localhost:8003' }
  }
});
```

```bash
# Terminal 1
cd inventory-frontend
npm run start:federated

# Terminal 2
cd compliance-frontend
npm run start:proxy
```

## PatternFly CSS Bundling

**Default**: PF styles excluded from bundle (served by chrome)

To include PF CSS in your bundle:

```javascript
config({
  rootFolder: resolve(__dirname, '../'),
  bundlePfModules: true
});
```

**Use only if**: Bugs require bundled PF styles (performance impact)

## Common Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `rootFolder` | string | - | Absolute path to app root |
| `useProxy` | boolean | false | Enable webpack proxy |
| `env` | string | - | Environment (stage-stable, prod-stable) |
| `useCloud` | boolean | false | Use cloud.redhat.com paths |
| `target` | string | - | Override target URL |
| `localChrome` | string | - | Path to local chrome build (must end with /) |
| `proxyVerbose` | boolean | false | Debug proxy behavior |
| `routes` | object | - | Custom route mappings |
| `routesPath` | string | - | Path to routes config file |
| `customProxy` | array | - | Custom webpack proxy configs |
| `registry` | array | - | Express middleware functions |
| `keycloakUri` | string | - | Override SSO URI |
| `useAgent` | boolean | true | Use agent for proxying |
| `bounceProd` | boolean | false | Bounce PROD non-GET via server |
| `standalone` | boolean/object | false | Standalone mode config |
| `reposDir` | string | - | Directory for standalone repos |
| `bundlePfModules` | boolean | false | Include PF CSS in bundle |

## Webpack 5 Migration

### Required Changes

```diff
-webpack-dev-server
+webpack serve
```

Update `webpack-cli` to `>=4.2.0`

### Removed Features

- `lodash-webpack-plugin` no longer maintained
  - Use direct imports: `import get from 'lodash/get'`

## Common Issues

### Proxy Not Working
**Check**:
- `/etc/hosts` patched (`npx fec patch-etc-hosts`)
- Correct env set (stage-stable vs prod-stable)
- localChrome path ends with `/`
- VPN connected for stage environments

### CORS Errors
**Solution**: Use `customProxy` with `changeOrigin: true`

### Static Assets 404
**Solution**: Verify `publicPath` matches deployment path

### Multiple Apps Not Proxying
**Check**: 
- Apps running on specified ports
- LOCAL_APPS format correct
- No port conflicts

## Documentation

- [Full README](./README.md) - Comprehensive 529-line guide
- [Config Utils](../config-utils/README.md) - Utility functions
- [Standalone Services](../config-utils/doc/advanced-features.md)

## Testing

```bash
# Test config changes
npm run build

# Verify proxy setup
npm run start:proxy
```

## Tips

1. **Always** run `npx fec patch-etc-hosts` once per machine
2. Use `proxyVerbose: true` when debugging proxy issues
3. localChrome path **must** end with `/`
4. Use `routesPath` for complex route configs
5. Use `registry` for file overrides during testing
6. PROD without VPN: set `useAgent: false, bounceProd: true`
7. Multiple apps: start webpack servers first, then proxy
