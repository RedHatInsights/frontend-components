# Core Configuration Functions

Main webpack configuration utilities for Red Hat Cloud Services applications.

## federatedModules

Configures webpack module federation for Red Hat Cloud Services applications.

### Basic Usage

```typescript
import { federatedModules } from '@redhat-cloud-services/frontend-components-config-utilities';

const config = federatedModules({
  root: __dirname,
  exposes: {
    './RootApp': './src/AppEntry'
  }
});
```

*This example pattern is used in: `src/federated-modules.ts:47-58`*

### Configuration Options

**FederatedModulesConfig Interface:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| root | string | required | Root directory path |
| exposes | { [module: string]: string } | `{ './RootApp': './src/AppEntry' }` | Modules to expose |
| shared | { [module: string]: WebpackSharedConfig }[] | `[]` | Additional shared dependencies |
| debug | boolean | `false` | Enable debug logging |
| moduleName | string | auto-generated | Module name override |
| useFileHash | boolean | `true` | Include content hash in filename |
| separateRuntime | boolean | `false` | Use separate runtime |
| exclude | string[] | `[]` | Packages to exclude from sharing |
| eager | boolean | `false` | ⚠️ Deprecated - Load modules eagerly |
| pluginMetadata | PluginBuildMetadata | auto-generated | Plugin metadata configuration |
| extensions | EncodedExtension[] | `[]` | Dynamic plugin extensions |

*Interface verified from: `src/federated-modules.ts:21-37`*

**WebpackSharedConfig Interface:**

| Property | Type | Description |
|----------|------|-------------|
| eager | boolean | Load module eagerly (not recommended) |
| import | string \| false | Import path for the module |
| packageName | string | Package name override |
| requiredVersion | string \| false | Required version constraint |
| shareKey | string | Key used for sharing |
| shareScope | string | Scope for sharing |
| singleton | boolean | Enforce singleton instance |
| strictVersion | boolean | Strict version matching |
| version | string \| false | Module version |

*Type verified from: `@openshift/dynamic-plugin-sdk-webpack` dependency*

### Shared Dependencies Configuration

```typescript
const config = federatedModules({
  root: __dirname,
  shared: [
    {
      'my-custom-lib': {
        singleton: true,
        requiredVersion: '^1.0.0',
        eager: false
      }
    }
  ]
});
```

*Pattern verified from: `src/federated-modules.ts:76-87`*

## proxy

Webpack development server proxy configuration for Red Hat Cloud Services environments.

### Basic Usage

```typescript
import { proxy } from '@redhat-cloud-services/frontend-components-config-utilities';

const proxyConfig = proxy({
  env: 'stage-stable',
  useProxy: true,
  publicPath: '/apps/myapp'
});
```

*This example pattern is used in: `src/proxy.ts:122-138`*

### Configuration Options

**ProxyOptions Interface:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| env | string | `'stage-stable'` | Target environment |
| customProxy | ProxyConfigItem[] | `[]` | Custom proxy configurations |
| routes | { [route: string]: ProxyConfigItem } | `undefined` | Route-specific proxy config |
| routesPath | string | `undefined` | Path to routes configuration file |
| useProxy | boolean | `false` | Enable proxy functionality |
| proxyURL | string | `'http://squid.corp.redhat.com:3128'` | Corporate proxy URL |
| standalone | boolean | `false` | Standalone mode |
| port | number | `undefined` | Development server port |
| reposDir | string | `undefined` | Local repositories directory |
| localChrome | string | `undefined` | Local chrome configuration |
| appUrl | (string \| RegExp)[] | `[]` | Application URLs to handle |
| publicPath | string | required | Application public path |
| proxyVerbose | boolean | `false` | Enable verbose proxy logging |
| useCloud | boolean | `false` | Use cloud domain instead of console |
| target | string | auto-generated | Proxy target URL |
| keycloakUri | string | `undefined` | Keycloak authentication URI |
| registry | ((...args: any[]) => void)[] | `undefined` | Registry functions |
| isChrome | boolean | `true` | ⚠️ Deprecated - Chrome mode |
| onBeforeSetupMiddleware | function | `undefined` | Middleware setup callback |
| bounceProd | boolean | `false` | Bounce production requests |
| useAgent | boolean | `true` | Use HTTP agent for requests |
| useDevBuild | boolean | `false` | Use development build |
| localApps | string | `process.env.LOCAL_APPS` | Local app configuration |
| blockLegacyChrome | boolean | `false` | Block legacy chrome usage |
| frontendCRDPath | string | `'deploy/frontend.yaml'` | Frontend CRD file path |

*Interface verified from: `src/proxy.ts:88-120`*

### Environment Configuration

```typescript
const prodConfig = proxy({
  env: 'prod-stable',
  useProxy: true,
  publicPath: '/apps/myapp'
});

const stageConfig = proxy({
  env: 'stage-stable',
  useAgent: true,
  publicPath: '/apps/myapp'
});
```

*Pattern verified from: `src/proxy.ts:192-201`*

### Local App Development

```typescript
const localConfig = proxy({
  env: 'stage-stable',
  localApps: 'advisor:8003,compliance:8004~https',
  publicPath: '/apps/myapp'
});
```

*Pattern verified from: `src/proxy.ts:65-86`*

## cookieTransform

Transforms authentication cookies for Red Hat Cloud Services proxy requests.

### Basic Usage

```typescript
import { cookieTransform } from '@redhat-cloud-services/frontend-components-config-utilities';

// Used internally by proxy configuration
const transform = cookieTransform(proxyReq, req, res, {
  user: { username: 'testuser' },
  internal: { org_id: '123' },
  identity: { custom: 'data' }
});
```

*This example pattern is used in: `src/proxy.ts:58`*

### Function Signature

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| proxyReq | http.ClientRequest | Proxy request object |
| req | ExpressRequest | Express request object |
| res | Response | Express response object |
| options | CookieTransformOptions | Configuration options |

*Function signature verified from: `src/cookieTransform.ts:19-35`*

### CookieTransformOptions Interface

| Property | Type | Description |
|----------|------|-------------|
| entitlements | { [sku: string]: Entitlement } | Service entitlements |
| user | any | User data overrides |
| internal | any | Internal data overrides |
| identity | any | Identity data overrides |

**Entitlement Interface:**

| Property | Type | Description |
|----------|------|-------------|
| is_entitled | boolean | Whether user is entitled to service |
| is_trial | boolean | Whether this is a trial entitlement |

*Types verified from: `src/cookieTransform.ts:5-34`*

### Default Entitlements

```typescript
const defaultEntitlements = {
  insights: { is_entitled: true },
  smart_management: { is_entitled: true },
  openshift: { is_entitled: true },
  hybrid: { is_entitled: true },
  migrations: { is_entitled: true },
  ansible: { is_entitled: true },
  cost_management: { is_entitled: true }
};
```

*Default values from: `src/cookieTransform.ts:9-17`*

## validateFrontendCrd

Validates Frontend Custom Resource Definition (CRD) files.

### Basic Usage

```typescript
import { validateFrontendCrd } from '@redhat-cloud-services/frontend-components-config-utilities';

const crd = {
  apiVersion: 'v1',
  kind: 'Template',
  objects: [/* CRD objects */]
};

validateFrontendCrd(crd);
```

*This example is tested in: `src/feo/validate-frontend-crd.test.ts:6-35`*