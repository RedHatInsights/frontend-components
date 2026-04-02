# Frontend Components - Monorepo

## Repository Overview

This is a monorepo of Red Hat Cloud Services components for React.js applications on console.redhat.com. It provides reusable UI components, utilities, and tooling for platform services.

### Architecture

- **Build System**: Nx workspace with independent package versioning
- **Framework**: React 18 with TypeScript
- **Component Library**: PatternFly 6
- **Testing**: Cypress (component), Jest (unit)
- **Release**: Automated via conventional commits

### Packages

- `components` - Common UI components
- `utils` - Utility functions and helpers
- `chrome` - Console chroming framework
- `notifications` - Toast notification system
- `remediations` - Remediation wizard components
- `advisor-components` - Advisor-specific components
- `rule-components` - Rule display components
- `translations` - i18n utilities
- `testing` - Testing utilities
- `config-utils` - Build configuration helpers
- `eslint-config` - Shared ESLint configuration

## Development Setup

### Prerequisites

```bash
node >= 20.0.0
npm >= 8.0.0
```

### Installation

```bash
npm install
```

### Local Development

Start the demo sandbox (linked to all packages):

```bash
npm run serve:demo
# Open http://localhost:4200/
```

Demo source: `examples/demo/src/app/app.tsx` (do not commit changes)

## Code Conventions

### TypeScript

- Strict mode enabled
- JSX transform: `react-jsx`
- Target: ES5, module: CommonJS
- Path aliases: Use `@redhat-cloud-services/*` imports

### Linting

- ESLint with Prettier integration
- Import sorting enforced
- TypeScript strict rules
- React hooks validation

### Git Workflow

- **Commit Format**: [Conventional Commits](https://www.conventionalcommits.org/)
  - `feat:` new features
  - `fix:` bug fixes
  - `chore:` maintenance
  - `docs:` documentation
- **Requirements**:
  - 2FA enabled on GitHub account
  - GPG-signed commits mandatory
- **Husky**: Pre-commit hooks run lint/tests (use `--no-verify` to skip locally, not in CI)

## Testing Strategy

### Component Testing (Preferred)

Use Cypress for all React components (runs in real browser vs JSDOM):

```bash
# Run all component tests
npm run test:component

# Test specific package
npx nx run @redhat-cloud-services/frontend-components:test:component

# Watch mode for development
npx nx run @redhat-cloud-services/frontend-components:test:component --watch
```

**Location**: `packages/*/cypress/**/*.cy.{ts,tsx}`

**Best Practices**:
- Test user interactions, not implementation
- Use data-testid for selectors
- Avoid snapshot tests (DOM attributes unstable)
- Test accessibility (ARIA labels, keyboard navigation)

### Unit Testing

Jest for hooks, utilities, and pure functions:

```bash
# Run all unit tests
npm run test:unit

# Update snapshots (use sparingly)
npm run test:unit:update

# Test specific package
npx nx run @redhat-cloud-services/frontend-components-utilities:test:unit
```

**Tools**:
- Jest + React Testing Library
- Coverage reports via Jest

### Quality Checks

```bash
# Lint all packages
npm run lint

# Check circular dependencies
npm run check-circular-imports

# Build all packages
npm run build
```

## Common Commands

```bash
# Build all packages
npm run build

# Run affected builds only (faster)
npx nx affected -t build

# Test affected packages
npx nx affected -t test:component
npx nx affected -t test:unit

# Lint affected packages
npx nx affected -t lint

# Generate dependency graph
npx nx graph
```

## Deployment & Release

### Release Process

**Fully automated** on merge to `master`:

1. CI runs: build, tests, lint, circular dependency checks
2. Conventional commits determine version bumps
3. Changelogs generated per package
4. Git tags created: `{packageName}-{version}`
5. Packages published to npm

**Version Control**: Independent package versioning (per-package semver)

### CI Pipeline

GitHub Actions (`.github/workflows/ci.yaml`):
- Install dependencies
- Build packages
- Unit tests
- Component tests (Cypress)
- Lint
- Commitlint validation
- Circular dependency check
- Release (on push to master)

## Browser Compatibility

- Modern browsers (last 2 versions)
- Chrome, Firefox, Safari, Edge
- No IE11 support

## Accessibility

- WCAG 2.1 AA compliance
- PatternFly accessible components by default
- Test with keyboard navigation
- Verify ARIA labels and roles
- Use semantic HTML

## Package-Specific Guides

For detailed package documentation, see:
- [Components Package](./packages/components/README.md)
- [Utils Package](./packages/utils/README.md)
- [Chrome Package](./packages/chrome/README.md)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- Package contribution guidelines
- Review process
- Security requirements
- Documentation standards

## Support

- **Team**: @platform-experience
- **Issues**: [GitHub Issues](https://github.com/RedHatInsights/frontend-components/issues)
