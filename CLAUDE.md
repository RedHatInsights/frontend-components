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

Node and npm versions are defined in `package.json` (engines field) and `.nvmrc`.

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

### Commit Message & Release Rules (Important for AI Tools)

Releases are **fully automated** — the commit type directly controls whether packages are published to npm. Choose the commit type carefully:

- **`feat:`** → triggers a **minor** version bump for the scoped package (with `useCommitScope: true`, only the package whose scope matches the commit scope gets the full bump; changed dependents are capped at **patch**)
- **`fix:`** → triggers a **patch** version bump for the scoped package (same scope-filtering applies)
- **`<type>!:` (any type with `!`) or `BREAKING CHANGE:` footer** → triggers a **major** version bump for the scoped package
- **`chore:`, `docs:`, `ci:`, `refactor:`, `test:`** → **no release triggered**

**Rules when committing:**
1. Use `feat:` when implementing a new feature or enhancement that changes package source code — this is expected and will correctly trigger an npm release.
2. Use `fix:` when fixing a bug in package source code.
3. Use `chore:` or `docs:` for changes that do **not** affect package source code — documentation (`CLAUDE.md`, `README.md`), CI config, linting config, or tooling setup — even if the files live inside a `packages/*/` directory.
4. If a commit includes both source code changes and non-code changes (e.g., a new feature plus updated docs), use `feat:` or `fix:` — the release is warranted by the code change.
5. **Commit scope rules** (`useCommitScope: true` in `nx.json`):
   - For **versioning commits** (`feat`, `fix`, `!` breaking change, or commits with a `BREAKING CHANGE:` footer): scope **must** be the full Nx project name (e.g., `feat(@redhat-cloud-services/frontend-components-utilities): ...`). Short scopes like `feat(utils):` or area scopes like `feat(deps):` will be rejected by commitlint.
   - For **non-versioning commits** (`chore`, `docs`, `ci`, `refactor`, `test`): any scope or no scope is fine (e.g., `chore(utils): ...`, `chore(deps): ...`).

### Package Dependency Updates (config ↔ config-utils)

When changes to `config-utils` are required by `config` package:

1. **Initial PR**: Release both packages together (commit triggers releases for both)
2. **Follow-up PR**: Pin config-utils version in `packages/config/package.json` after release

**Note**: Don't pin version in initial PR — CI install happens before release, causing npm install failure for unreleased versions.

### Package Publishing (.npmignore)

All packages use a **single root `.npmignore` file** that is automatically copied to each package's `dist/` folder during build. This ensures consistent npm package contents across all packages.

**How it works:**
1. Root `.npmignore` defines patterns for files to exclude from published packages (test files, source maps, etc.)
2. Each package's `project.json` includes: `"assets": [{ "input": ".", "glob": ".npmignore", "output": "." }]`
3. On build, Nx copies root `.npmignore` → `dist/@redhat-cloud-services/{package}/.npmignore`
4. When published, npm uses this file to filter package contents

**Maintenance:**
- **Never** create per-package `.npmignore` files — update the root file only
- Root `.npmignore` is protected in `CODEOWNERS` (requires `@RedHatInsights/experience-services-admins` approval)
- Test changes with `npm pack` in a package's dist folder before publishing

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

### How Nx Calculates Package Versions

**Source of truth is git tags, NOT `package.json`.**
With `conventionalCommits: true`, Nx reads the current version from the latest matching git tag. The `package.json` version field is an *output* of `nx release`, not an input.

**Tag pattern**: `{projectName}-{version}` (configured in `nx.json` line 114)
- Example: `@redhat-cloud-services/frontend-components-7.10.0`, `@redhat-cloud-services/chrome-2.4.0`
- Note: uses `-` separator, not the Nx default `@` for independent projects

**Version bump calculation** (per package):
1. Find the latest git tag matching `{projectName}-*` with valid semver
2. Get all commits from that tag to HEAD
3. Filter to commits whose **scope matches the project name** (`useCommitScope: true`). The scoped package gets the full bump (minor/patch/major); dependent packages whose files changed but weren't in the scope get capped at **patch**.
4. Apply conventional-commit bump rules (see [Commit Message & Release Rules](#commit-message--release-rules-important-for-ai-tools) above)
5. Highest bump across all matching commits wins
6. **No matching `feat`/`fix` commits = package is skipped entirely** -- no bump, no publish

**What `package.json` version means**: Updated by `nx release` in both `{projectRoot}/package.json` and `dist/{projectName}/package.json`. It reflects the last released version, not the source for calculating the next one.

### Release Pipeline (on merge to `master`)

**Gate jobs** (all must pass before release runs):
install, build, unit-test, component-test, lint, commitlint, check-circular-imports

**Release sequence** (`npx nx release --yes`):
1. **Pre-version build**: `npx nx run-many -t build --exclude=demo,` -- ensures `dist/` exists
2. **Version**: for each package: find latest tag --> git log since tag --> parse conventional commits --> calculate bump --> update `package.json` (source + dist) + `package-lock.json` + `CHANGELOG.md`
3. **Git**: GPG-signed commit `chore(release): publish` with release notes + per-package tags
4. **Publish**: each bumped package from `dist/{projectName}` to npm with provenance (OIDC)
5. **Push**: `HUSKY=0 git push --follow-tags`

**Additional behaviors**:
- `preserveLocalDependencyProtocols: false` -- `workspace:*` refs resolved to concrete versions during release
- `skipLockFileUpdate: false` -- `package-lock.json` updated in the release commit
- Bot account (NachoBot) with GPG signing handles the release commit
- `npm-publish` environment provides `contents: write` + `id-token: write` permissions

### Key Config Files

| File | Purpose |
|------|---------|
| `nx.json` (lines 87-115) | Nx release configuration |
| `.github/workflows/ci.yaml` | CI pipeline definition |
| `.github/actions/release/action.yml` | Release composite action |
| `commitlint.config.js` | Commit message validation rules |

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
