# useInsightsNavigate

This hook is equivalent to the `InsightsLink` component, but is a wrapper around React Routers `useNavigate` hook.
It allows Insights applications to continue using "absolute" paths within their applications when migrating to React Router v6.

## Usage

Where you would use a `useNavigate` from React Router, you can use `useInsightsNavigate` instead.

```JSX
import React, { Fragment } from 'react';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';

const MyCmp = () => {
    const navigate = useInsightsNavigate();
    const navigateToInventory = useInsightsNavigate('inventory');
    const navigateToInventoryPreview = useInsightsNavigate('inventory', true);

    return (
        <>
            <a onClick={() => navigate('/policies/ID')}>
              navigate to the `/policies/ID` under `/insights/compliance` results in navigate to `/insights/compliance/policies/ID`
            </a>

            <a onClick={() => navigate('/policies/ID')}>
              navigate to the `/policies/ID` under `/preview/insights/compliance` results in navigate to `/insights/compliance/policies/ID`
            </a>

            <a onClick={() => navigateToInventory('/ID')}>
              navigate to the `/ID` in the Inventory app under `/insights/compliance` results in navigate to `/insights/inventory/ID`
            </a>

            <a onClick={() => navigateToInventory('/ID')}>
              navigate to the `/ID` in the Inventory app under `/preview/insights/compliance` results in navigate to `/insights/inventory/ID`
            </a>

            <a onClick={() => navigateToInventoryPreview('/ID')}>
              navigate to the `/ID` in the Inventory app under `/insights/compliance` results in navigate to `/preview/insights/inventory/ID`
            </a>
        </>
    );
}
```
## Params

useInsightsNavigate

```javascript
{
    app: string;
    preview: boolean;
};
```
