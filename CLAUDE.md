# Claude Code Configuration

## Claude Context

@CHANGELOG.md
@CONTRIBUTING.md
@tmp/CLAUDE.md

## Working Directory

Always run commands from the project root directory (where this CLAUDE.md file is located) to avoid confusion as to where you are in the filesystem. 

## Show all projects

```sh
npx nx show projects
```

### Build and test commands for a specific package

```sh
npx nx run @redhat-cloud-services/frontend-components:build --skip-nx-cache
npx nx run @redhat-cloud-services/frontend-components:test:unit --skip-nx-cache
npx nx run @redhat-cloud-services/frontend-components:test:component --skip-nx-cache
```

### Build and test commands for all packages

```sh
npm run
npm run build
npm run test:unit
npm run test:component
npm run lint
```
