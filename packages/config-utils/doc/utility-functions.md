# Utility Functions

Helper utilities and tools for webpack configuration and development workflows.

## searchIgnoredStyles

Generates webpack alias configuration to ignore PatternFly CSS files, preventing style conflicts in federated modules.

### Basic Usage

```typescript
import { searchIgnoredStyles } from '@redhat-cloud-services/frontend-components-config-utilities';

const stylesAlias = searchIgnoredStyles('/path/to/project/root');
// Returns: { '/path/to/project/root/node_modules/@patternfly/react-styles/css/components/Button/button.css': false }
```

*This example pattern is tested in: `src/search-ignored-styles.test.ts:20-33`*

### Function Signature

```typescript
function searchIgnoredStyles(root: string, ...paths: string[]): { [cssFilePath: string]: false }
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| root | string | Absolute directory path to project root containing package.json |
| ...paths | string[] | Additional node_modules directory paths to search |

**Returns:** `{ [cssFilePath: string]: false }`

Webpack alias object mapping CSS file paths to `false` (ignored/excluded from bundling).

*Function signature verified from: `src/search-ignored-styles.ts:15`*

### Multiple Paths Configuration

```typescript
const stylesAlias = searchIgnoredStyles(
  '/project/root',
  '/custom/node_modules',
  '/shared/modules'
);
```

*Pattern tested in: `src/search-ignored-styles.test.ts:35-45`*

### Webpack Integration

```typescript
import { searchIgnoredStyles } from '@redhat-cloud-services/frontend-components-config-utilities';

module.exports = {
  resolve: {
    alias: {
      ...searchIgnoredStyles(__dirname),
      // Other aliases
    }
  }
};
```

### Warning Behavior

When no PatternFly CSS files are found, the function logs a warning:

```
[fec] WARNING: No PF CSS assets found!
Your application can override PF styling in deployed environments!
Please check your build configuration.
```

*Warning behavior tested in: `src/search-ignored-styles.test.ts:55-64`*

### File Search Pattern

The function searches for CSS files using the pattern:
- `{root}/node_modules/@patternfly/react-styles/**/*.css`
- `{additionalPath}/@patternfly/react-styles/**/*.css`

*Search patterns verified in: `src/search-ignored-styles.test.ts:91-100`*

## generatePFSharedAssetsList

Discovers PatternFly dynamic modules and generates webpack federation shared configuration for module federation setups.

### Basic Usage

```typescript
import { generatePFSharedAssetsList } from '@redhat-cloud-services/frontend-components-config-utilities';

const sharedModules = generatePFSharedAssetsList('/path/to/project/root');
// Returns: {
//   '@patternfly/react-core/dist/dynamic/Button': { requiredVersion: '^5.2.0' },
//   '@patternfly/react-icons/dist/dynamic/ArrowIcon': { requiredVersion: '^5.1.0' }
// }
```

*This example pattern is tested in: `src/generate-pf-shared-assets-list.test.ts:23-56`*

### Function Signature

```typescript
function generatePFSharedAssetsList(root: string): { [moduleName: string]: { requiredVersion: string } }
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| root | string | Absolute path to project root directory containing package.json |

**Returns:** `{ [moduleName: string]: { requiredVersion: string } }`

Object mapping dynamic module names to their configuration with required versions.

*Function signature verified from: `src/generate-pf-shared-assets-list.ts:17`*

### PatternFly Version Requirements

The function requires PatternFly packages version 5.0.0 or higher:

- `@patternfly/react-core` >= 5.0.0
- `@patternfly/react-icons` >= 5.0.0

For unsupported versions, the function returns an empty object and logs a warning.

*Version checking verified from: `src/generate-pf-shared-assets-list.test.ts:58-74`*

### Dependencies Location

The function checks for PatternFly packages in both `dependencies` and `devDependencies`:

```json
{
  "dependencies": {
    "@patternfly/react-core": "^5.2.0"
  },
  "devDependencies": {
    "@patternfly/react-icons": "^5.1.0"
  }
}
```

*Dependency resolution tested in: `src/generate-pf-shared-assets-list.test.ts:94-112`*

### Module Discovery Process

1. **Version Validation**: Checks PatternFly package versions in package.json
2. **File Discovery**: Searches for dynamic modules using glob patterns:
   - `{root}/node_modules/@patternfly/react-core/dist/dynamic/*/**/package.json`
   - `{root}/node_modules/@patternfly/react-icons/dist/dynamic/*/**/package.json`
3. **Module Mapping**: Extracts module names and maps them with required versions

*Discovery process verified in: `src/generate-pf-shared-assets-list.test.ts:155-173`*

### Error Handling

```typescript
// Throws error for missing root directory
generatePFSharedAssetsList(''); // Error: 'Provide a directory of your node_modules to find dynamic modules'

// Throws error for malformed module paths
// Error: 'Unable to get module name from: /invalid/path'
```

*Error handling tested in: `src/generate-pf-shared-assets-list.test.ts:114-118,175-192`*

### Webpack Module Federation Integration

```typescript
import { federatedModules, generatePFSharedAssetsList } from '@redhat-cloud-services/frontend-components-config-utilities';

const config = federatedModules({
  root: __dirname,
  shared: [generatePFSharedAssetsList(__dirname)]
});
```

### Version Format Support

The function handles various version formats:

```json
{
  "dependencies": {
    "@patternfly/react-core": "^5.2.0",  // Caret
    "@patternfly/react-icons": "~5.1.0", // Tilde  
    "@patternfly/react-table": "5.0.0"   // Exact
  }
}
```

*Version format handling tested in: `src/generate-pf-shared-assets-list.test.ts:120-137`*

## jsVarName

Converts strings to valid JavaScript variable names.

### Basic Usage

```typescript
import { jsVarName } from '@redhat-cloud-services/frontend-components-config-utilities';

const varName = jsVarName('my-app-name'); // Returns valid JS variable name
```

*Export verified from: `src/index.ts:3`*

## fecLogger

Logging utility for frontend components configuration.

### Basic Usage

```typescript
import { fecLogger, LogType } from '@redhat-cloud-services/frontend-components-config-utilities';

fecLogger(LogType.info, 'Configuration loaded successfully');
fecLogger(LogType.warn, 'Fallback configuration used');
```

*Usage pattern from: `src/federated-modules.ts:122`*

### LogType Enum

| Value | Description |
|-------|-------------|
| LogType.error | Error level logging |
| LogType.warn | Warning level logging |
| LogType.info | Information level logging |
| LogType.debug | Debug level logging |

*Enum verified from: `src/fec-logger.ts:9-14`*