# InsightsLink

This is a wrapper around the React Router [`Link`](https://reactrouter.com/en/main/components/link#link) component.
It allows applications to (continue to) use "absolute" paths within their applications scope as/in `to` for `Link`s.

The component will return a `Link` with absolute path with `(/preview)/insights/APP/PASSED_PATH`.

## Usage

Where ever you'd use a React Router `Link` component use `InsightsLink`.

```JSX
import React from 'react';
import InsightsLink from '@redhat-cloud-services/frontend-components/InsightsLink';

class YourCmp extends React.Component {
  render() {
    return (
      <>
        <InsightsLink to="/scappolicies">
          Link to Scap Policies under `/insights/compliance/...` will link to `/insights/compliance/scappolicies`
        </InsightsLink>

        <InsightsLink to="/scappolicies" preview>
          Link to Scap Policies under `/insights/compliance/...` will link to `/preview/insights/compliance/scappolicies`
        </InsightsLink>

        <InsightsLink to={{ pathname: '/scappolicies' }}>
          Link to Scap Policies under `/preview/insights/compliance` will link to `/insights/compliance/scappolicies`
        </InsightsLink>

        {/*
          This is useful for Links that are within components that are shared in other apps as federated modules
          It will force the given app as target application.
        */}
        <InsightsLink to={'/ID_OF_A_SYSTEM'} app="inventory">
          Link Inventory sytems page under `/insights/compliance/systems` will link to `/insights/inventory/ID_OF_A_SYSTEM`
        </InsightsLink>

        {/*
          In cases where you want to add from a none preview section (forcibly) to a section under /preview.
        */}
        <InsightsLink to={'/ID_OF_A_SYSTEM'} app="inventory" preview>
          Link Inventory sytems page under `/insights/compliance/systems` will link to `/preview/insights/inventory/ID_OF_A_SYSTEM`
        </InsightsLink>

        <InsightsLink to={'/ID_OF_A_SYSTEM'} app="inventory" preview={false}>
          Link Inventory sytems page under `/preview/insights/compliance/systems` will link to `/insights/inventory/ID_OF_A_SYSTEM`
        </InsightsLink>
      </>
    )
  }
}
```

## Props

InsightsLink

```javascript
{
    to: LinkProps['to'];
    app: string;
    preview: boolean;
};
```
