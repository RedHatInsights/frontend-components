# Project Description for AI Agents

## Overview

This repository contains **frontend-components**, a monorepo that creates common JavaScript packages for the Red Hat Hybrid Cloud Console project. The repository provides reusable React components, utilities, configurations, and tools used across multiple Red Hat Cloud Services applications.

## Repository Management

- **Monorepo Tool**: NX (Nx) workspace
- **Package Manager**: npm with workspaces
- **Build System**: Multiple build targets managed by NX
- **Node Version**: >=16.0.0
- **npm Version**: >=7.0.0

## Project Structure

### Root Level
- `packages/` - Contains all individual packages
- `examples/demo/` - Demo application for testing components
- `docs/` - Documentation for various components and features
- `config/` - Global configuration files
- `ai-agent-rules/` - Rules and guidelines for AI agents

### Key Packages

#### Core Component Libraries
- **`packages/components/`** - Main UI component library (React components, hooks, utilities)
- **`packages/chrome/`** - Chrome/navigation context and providers
- **`packages/utils/`** - Shared utilities, helpers, and hooks

#### Configuration & Build Tools
- **`packages/config/`** - Webpack and build configurations
- **`packages/config-utils/`** - Configuration utilities and helpers
- **`packages/eslint-config/`** - Shared ESLint configuration

#### Specialized Components
- **`packages/advisor-components/`** - Components for Red Hat Insights Advisor
- **`packages/notifications/`** - Notification system components
- **`packages/remediations/`** - Remediation workflow components
- **`packages/rule-components/`** - Rule and recommendation components

#### Development Tools
- **`packages/testing/`** - Testing utilities and helpers
- **`packages/executors/`** - NX executors for build processes (runs from TypeScript source, no building required)
- **`packages/translations/`** - Internationalization utilities

#### Type Definitions
- **`packages/types/`** - TypeScript type definitions
- **`packages/tsc-transform-imports/`** - TypeScript transform utilities

## Technology Stack

- **React**: 18.3.1
- **TypeScript**: 5.6.3
- **PatternFly**: 6.2.2 (Red Hat's design system)
- **Testing**: Jest, Cypress, Testing Library
- **Build Tools**: Webpack, Vite, SWC
- **Linting**: ESLint with custom configurations

## Common Tasks and Locations

### Adding New Components
- **Location**: `packages/components/src/`
- **Structure**: Each component has its own directory with `.tsx`, `.scss`, `index.ts`, and test files
- **Export**: Add to `packages/components/src/index.ts`

### Modifying Build Configuration
- **Webpack configs**: `packages/config/src/`
- **NX configuration**: `nx.json` and individual `project.json` files
- **TypeScript configs**: Various `tsconfig.*.json` files

### Adding Documentation
- **Component docs**: `packages/[package-name]/doc/`
- **General docs**: `docs/` directory
- **README files**: Each package has its own README

### Testing
- **Unit tests**: Co-located with source files (`.test.js`, `.test.tsx`)
- **Component tests**: `cypress/component/` directories
- **Integration tests**: Package-specific test configurations

## Build and Development Commands

```bash
# Build all packages
npm run build

# Run linting
npm run lint

# Run unit tests
npm run test:unit

# Run component tests
npm run test:component

# Serve demo application
npm run serve:demo
```

## Package Publishing

- Packages are published to npm registry
- Version management handled by NX and semantic versioning
- Each package has independent versioning in its own CHANGELOG.md

## Important Notes for AI Agents

1. **Always check existing patterns** before creating new components - look at similar components in `packages/components/src/`

2. **Follow PatternFly design system** - this project heavily uses PatternFly components and styling

3. **NX workspace structure** - Use `nx` commands for building, testing, and running tasks across packages

4. **TypeScript strict mode** - All packages use strict TypeScript configurations

5. **Testing requirements** - New components should include unit tests and may need component tests

6. **Documentation** - Update relevant documentation when making changes

7. **Interdependencies** - Be aware that packages may depend on each other; check `package.json` files for dependencies

8. **Build artifacts** - Built packages go to `dist/` directory with separate CJS and ESM builds