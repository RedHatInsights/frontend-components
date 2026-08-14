# Config Utils Documentation

This directory contains comprehensive documentation for the `@redhat-cloud-services/frontend-components-config-utilities` package.

## 📚 Documentation Files

### Core Configuration Functions
- **[Core Functions](./core-functions.md)** - Main webpack configuration utilities
  - `federatedModules` - Module federation configuration
  - `proxy` - Development server proxy setup
  - `cookieTransform` - Authentication cookie transformation
  - `validateFrontendCrd` - Frontend CRD validation

### Utility Functions  
- **[Utility Functions](./utility-functions.md)** - Helper utilities and tools
  - `searchIgnoredStyles` - PatternFly CSS webpack aliases
  - `generatePFSharedAssetsList` - PatternFly dynamic modules discovery
  - `jsVarName` - String to JavaScript variable name conversion
  - `fecLogger` - Frontend components logging utility

### Advanced Features
- **[Advanced Features](./advanced-features.md)** - Enhanced development experience
  - FEO (Frontend Experience Optimization) features
  - Local development workflows
  - Environment configuration
  - Complete development setups

## 🚀 Quick Start

```bash
npm install @redhat-cloud-services/frontend-components-config-utilities
```

```typescript
import { federatedModules, proxy } from '@redhat-cloud-services/frontend-components-config-utilities';

// Basic module federation setup
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

## 📖 Package Overview

This package provides essential webpack configuration utilities for Red Hat Cloud Services applications, including:

- **Module Federation**: Federated webpack configuration for micro-frontends
- **Development Proxy**: Proxy configuration for local development against remote environments  
- **PatternFly Integration**: CSS optimization and dynamic module discovery
- **FEO Features**: Enhanced local development experience with navigation interception
- **Utilities**: Helper functions for configuration generation and logging

## 🔗 Related Documentation

- [Package README](../README.md) - Package overview and installation
- [Root Documentation](../../../README.md) - Frontend Components monorepo overview

## 🧪 Testing

All documented functionality is verified by comprehensive unit tests. Test files validate the accuracy of examples and ensure documentation stays current with code changes.

## 📝 Contributing

When updating documentation:

1. Keep individual files focused and under ~500 lines
2. Verify all examples with existing test files
3. Reference test files that validate documented behavior
4. Update this overview when adding new documentation files