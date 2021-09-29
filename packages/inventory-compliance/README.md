# RedHat Cloud Services frontend components - inventory compliance
[![npm version](https://badge.fury.io/js/%40redhat-cloud-services%2Ffrontend-components-inventory-compliance.svg)](https://badge.fury.io/js/%40redhat-cloud-services%2Ffrontend-components-inventory-compliance)


This package exports components to show compliance detail page, it has dependency on graphql to query server.

## !!!This package is deprecated!!!

Do not use this package anymore, if you want to use compliance detail you can use federated modules provided by compliance team

```JSX
import React from 'react';
import { useStore } from 'react-redux';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';

const ComplianceTab = () => {
    const store = useStore();
    return <AsyncComponent
        appName="compliance"
        module="./SystemDetail"
        store={store}
    />;
};

export default ComplianceTab;
```
## Installation
With NPM
```bash
npm i -S @redhat-cloud-services/frontend-components-inventory-compliance
```

With yarn
```bash
yarn add @redhat-cloud-services/frontend-components-inventory-compliance
```

This package is dependent on [@redhat-cloud-services/frontend-components-utilities](https://www.npmjs.com/package/@redhat-cloud-services/frontend-components-utilities), [@redhat-cloud-services/frontend-components](https://www.npmjs.com/package/@redhat-cloud-services/frontend-components) and [@redhat-cloud-services/frontend-components-notifications](@redhat-cloud-services/frontend-components-notifications) will automatically install them trough direct dependencies.

## Migration guide v2 -> v3
The component API has not changed. The only changes in v3 are import paths.
### Import paths

Stop using esm/cjs imports. The correct build version is chosen at build time. Instead of using esm/cjs import path, use the direct import path to the component source. Although it's still possible to import all components from the index file `import { X } from '@redhat-cloud-services/frontend-components-inventory-compliance'`, it's highly recommended to use direct import paths to improve build times and improve tree shaking.

### Default component import path
```diff
-import ComplianceSystemDetails from '@redhat-cloud-services/frontend-components-inventory-compliance/esm';
+import ComplianceSystemDetails from '@redhat-cloud-services/frontend-components-inventory-compliance/Compliance';
```

### ComplianceEmptyState import path
```diff
-import { ComplianceEmptyState } from '@redhat-cloud-services/frontend-components-inventory-compliance/esm';
+import ComplianceEmptyState from '@redhat-cloud-services/frontend-components-inventory-compliance/ComplianceEmptyState';
```
### SystemRulesTable import paths

**The selectColumns function is not aliased**

```diff
-import { SystemRulesTable, selectRulesTableColumns } from '@redhat-cloud-services/frontend-components-inventory-compliance/esm';
+import SystemRulesTable, { selectColumns as selectRulesTableColumns } from '@redhat-cloud-services/frontend-components-inventory-compliance/SystemRulesTable';
```
### Utils import paths
```diff
-import { ChipBuilder, FilterBuilder, FilterConfigBuilder } from '@redhat-cloud-services/frontend-components-inventory-compliance/esm';
+import { ChipBuilder, FilterBuilder, FilterConfigBuilder } from '@redhat-cloud-services/frontend-components-inventory-compliance/Utilities';
```

### Do not import CSS files
Import css/scss files is no longer required. Component injects necessary CSS whenever it is used.

**In scss**
```diff
-@import "~@redhat-cloud-services/frontend-components-inventory-compliance/index.css";
```

**In JS**
```diff
-import "@redhat-cloud-services/frontend-components-inventory-compliance/index.css";
```
