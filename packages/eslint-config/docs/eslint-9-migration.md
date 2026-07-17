# Eslint 9 migration guide

Official Eslint migration guide: https://eslint.org/docs/latest/use/migrate-to-9.0.0

## HCC UI module migration

### Upgrade eslint packages

Upgrade the `@redhat-cloud-services/eslint-config-redhat-cloud-services` package to v `^3.0.0`.

Upgrade any locally installed eslint-related packages in your repository to version compatible with eslint@9.

### Update your eslint config

Eslint 9 changes its configuration schema quite significantly. Composite configurations can now be composed, instead of referenced by a string. To use the FEC configuration you can compose it:

```js
import { defineConfig } from "eslint/config";
import fecPlugin from '@redhat-cloud-services/eslint-config-redhat-cloud-services'

export default defineConfig(
  fecConfig,
  {
    // custom configuration
  }
)
```
