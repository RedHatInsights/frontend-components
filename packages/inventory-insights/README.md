# RedHat Cloud Services frontend components - inventory insights
[![npm version](https://badge.fury.io/js/%40redhat-cloud-services%2Ffrontend-components-inventory-insights.svg)](https://badge.fury.io/js/%40redhat-cloud-services%2Ffrontend-components-inventory-insights)


This package exports components to show rules detail page.

## !!!This package is deprecated!!!

Do not use this package anymore, if you want to use advisor detail you can use federated modules provided by advisor team

```JSX
import React from 'react';
import { useStore } from 'react-redux';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';

const AdvisorTab = () => {
    const store = useStore();
    return <AsyncComponent
        appName="advisor"
        module="./SystemDetail"
        store={store}
        customItnl
        intlProps={{
            locale: navigator.language
        }}
    />;
};

export default AdvisorTab;
```

## Installation
With NPM
```bash
npm i -S @redhat-cloud-services/frontend-components-inventory-insights
```

With yarn
```bash
yarn add @redhat-cloud-services/frontend-components-inventory-insights
```

This package is dependent on [@redhat-cloud-services/frontend-components-utilities](https://www.npmjs.com/package/@redhat-cloud-services/frontend-components-utilities), [@redhat-cloud-services/frontend-components](https://www.npmjs.com/package/@redhat-cloud-services/frontend-components), [@redhat-cloud-services/frontend-components-remediations](https://www.npmjs.com/package/@redhat-cloud-services/frontend-components-remediations) and [@redhat-cloud-services/frontend-components-notifications](@redhat-cloud-services/frontend-components-notifications) will automatically install them trough direct dependencies.


## Migration v2 -> v3

### Import paths

Its no longer required to directly reference cjs/esm version of the builds.

```diff
- import InventoryInsights from '@redhat-cloud-services/frontend-components-inventory-insights/esm'
+ import InventoryInsights from '@redhat-cloud-services/frontend-components-inventory-insights'
```

### Styling

It is no longer required to import css separatelly. Styles are injected automatically when the component is used

```diff
- @import '@redhat-cloud-services/frontend-components/index.css';

```
