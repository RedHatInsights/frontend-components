# Frontend Components Config Utilities

[![npm version](https://badge.fury.io/js/%40redhat-cloud-services%2Ffrontend-components-config-utilities.svg)](https://badge.fury.io/js/%40redhat-cloud-services%2Ffrontend-components-config-utilities)

Essential webpack configuration utilities for Red Hat Cloud Services applications, providing module federation, development proxy setup, and PatternFly integration.

## 🚀 Quick Start

```bash
npm install @redhat-cloud-services/frontend-components-config-utilities
```

```typescript
import { federatedModules, proxy } from '@redhat-cloud-services/frontend-components-config-utilities';

// Module federation setup
const moduleConfig = federatedModules({
  root: __dirname,
  exposes: { './RootApp': './src/AppEntry' }
});

// Development proxy configuration  
const proxyConfig = proxy({
  env: 'stage-stable',
  useProxy: true,
  publicPath: '/apps/myapp'
});
```

## 📚 Core Functions

### Module Federation
- **`federatedModules`** - Webpack module federation configuration for micro-frontends
- **`generatePFSharedAssetsList`** - PatternFly dynamic modules discovery

### Development Tools
- **`proxy`** - Development server proxy for Red Hat environments
- **`cookieTransform`** - Authentication cookie transformation
- **`validateFrontendCrd`** - Frontend CRD validation

### Utilities
- **`searchIgnoredStyles`** - PatternFly CSS webpack aliases
- **`jsVarName`** - String to JavaScript variable name conversion  
- **`fecLogger`** - Logging utility with colored output

## 📖 Documentation

Comprehensive documentation is available in the [`doc/`](./doc/) directory:

- **[📋 Documentation Overview](./doc/README.md)** - Complete guide to all documentation files
- **[⚙️ Core Functions](./doc/core-functions.md)** - Module federation, proxy, and validation
- **[🛠️ Utility Functions](./doc/utility-functions.md)** - Helper utilities and tools
- **[🚀 Advanced Features](./doc/advanced-features.md)** - FEO features and development workflows

## 🏗️ Features

### Module Federation Support
- Automatic shared dependency configuration
- PatternFly dynamic module integration
- Federated module generation with proper versioning

### Development Experience
- **FEO (Frontend Experience Optimization)** features
- Local app proxy configuration with environment switching
- Enhanced local development with navigation interception

### PatternFly Integration
- CSS optimization and conflict prevention
- Dynamic module discovery for webpack federation
- Automatic version validation and compatibility checking

## 🧪 Testing

All functionality is validated by comprehensive unit tests that ensure documentation accuracy:

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

Test files demonstrate real working examples and validate all documented APIs.

## 🔗 Related Packages

- [`@redhat-cloud-services/frontend-components-config`](../config/) - Main webpack configuration
- [`@redhat-cloud-services/frontend-components`](../components/) - React components
- [`@redhat-cloud-services/frontend-components-utilities`](../utilities/) - Utility functions

## 📝 Contributing

When contributing to this package:

1. **Update documentation** in the `doc/` directory for any new features
2. **Add comprehensive tests** that validate documented behavior
3. **Reference test files** in documentation to ensure accuracy
4. **Keep documentation files focused** and under ~500 lines each

## 📄 License

Apache License 2.0