# Advanced Features

Enhanced development experience and advanced configuration options.

## FEO (Frontend Experience Optimization)

The package includes FEO features for enhanced local development experience:

- Navigation interception and modification
- Service tiles interception  
- Widget registry interception
- Search result interception

These features are automatically enabled when a `deploy/frontend.yaml` file is present in your project.

## Development Workflows

### Local App Proxy Configuration

Configure local application proxying for development:

```bash
LOCAL_APPS=advisor:8003,compliance:8004 npm start
```

This creates proxy routes for local applications during development.

*Pattern verified from: `src/proxy.ts:65-86`*

### Environment Configuration

Supported environments:
- `prod-stable` - Production environment
- `stage-stable` - Staging environment  
- `dev` - Development environment
- Custom environment names

### Complete Development Setup

```typescript
import { federatedModules, proxy } from '@redhat-cloud-services/frontend-components-config-utilities';

// Module federation setup
const moduleConfig = federatedModules({
  root: __dirname,
  debug: true,
  shared: [
    {
      'react': { singleton: true, eager: false }
    }
  ]
});

// Development proxy setup
const proxyConfig = proxy({
  env: 'stage-stable',
  useProxy: true,
  localApps: 'myapp:8003',
  publicPath: '/apps/myapp',
  proxyVerbose: true
});
```

## Type Definitions

The package exports TypeScript types for configuration:

```typescript
import type { 
  FederatedModulesConfig,
  ProxyOptions,
  Entitlement,
  WebpackSharedConfig
} from '@redhat-cloud-services/frontend-components-config-utilities';
```

*Types verified from: `src/federated-modules.ts:21`, `src/proxy.ts:88`, `src/cookieTransform.ts:5`*

## Testing

Unit tests validate the functionality and provide usage examples:
- FEO validation: `src/feo/validate-frontend-crd.test.ts`
- Navigation interception: `src/feo/navigation-interceptor.test.ts`

The test files demonstrate real working examples of all documented APIs.