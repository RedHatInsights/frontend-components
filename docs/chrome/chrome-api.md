## Chrome public API

Chrome provides an API that provides additional information and functions to each application.

## `useChrome`

To access the chrome API please, use the `useChrome` hook from the `@redhat-cloud-services/frontend-components` package.

```jsx
import React from 'react';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const MyComponent = () => {
  const chrome = useChrome();
  const isBetaEnv = chrome.isBeta() ? 'foo' : 'bar';
  if (isBetaEnv) {
    console.log('Chrome in beta env');
  } else {
    console.log('Chrome in stable env');
  }
  return <div>...</div>;
};

export default MyComponent;

```

## API methods

### `appAction`

Update a page action for OUIA. The action id is provided to the analytics service. For instance, to open a `create entity` dialog, do the following:

```jsx
import React from 'react';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const MyComponent = () => {
  const { appAction } = useChrome();
  const handleClick = () => {
    appAction('create-entity');
  };

  return <button onClick={handleClick}>Open create dialog</button>;
};

export default MyComponent;

```

### `appObjectId`

Update object ID used in the current action. For instance, to open a `edit entity` dialog for entity with ID `5`, do the following:


```jsx
import React from 'react';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const MyComponent = () => {
  const { appAction, appObjectId } = useChrome();
  const handleClick = () => {
    appAction('edit-entity');
    appObjectId(5);
  };

  return <button onClick={handleClick}>Open create dialong</button>;
};

export default MyComponent;

```

### `appNavClick`

Highlights a chrome navigation item.

> NOTE: Navigation items are highligted based on browser URL. This function has no longer any effect.


### `auth`

Object with chrome authentication API.
#### `auth.getOfflineToken`

A **promise** that returns an offline authentication token if available.

#### `auth.getToken`

A **promise** that returns authentication token if available.

#### `auth.getUser`

A **promise** that returns the logged-in user object.

#### `auth.login`

A function that redirects the browser to Red Hat SSO.

#### `auth.logout`

A function that logs out a current user and redirects the browser to the landing page.

### `createCase`

A function through which a support case is created. By default, any support case contains the following:

```js
{
  createdBy, // current user
  environment, // current environtment (Production, Production beta)
  product, // current product
}
```

<br />
In addition to the default data, you can also add additional options:

```jsx
import React from 'react';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const MyComponent = () => {
  const { createCase } = useChrome();
  const handleClick = () => {
    const options = {
      // custom object with no specified shape
      caseFields: {
        foo: 'bar',
      },
      // any additional data will be sent to sentry
      foo: 'nar',
    };
    createCase(options);
  };

  return <button onClick={handleClick}>Open create dialong</button>;
};

export default MyComponent;

```

### `enable`

Object containing functions that enable additional debugging options.
#### `enable.forcePendo`

A function that forces Pendo initialization.

#### `enable.invTags`

A function that enables experimental tags in inventory.
#### `enable.iqe`

A function that enables some iqe functions for QE purposes.

A function that enables experimental tags in inventory.
#### `enable.jwtDebug`

A function that enables additional JWT logging.
#### `enable.remediationsDebug`

A function that enables additional debug buttons in remediations application.
#### `enable.shortSession`

A function that enables a short session to test automatic logouts.

### `getApp`

A function that will return the name of the current application:

```tsx
function getApp(): string | undefined

// URL: https://ci.console.redhat.com/beta/insights/advisor/recommendations
getApp() // => 'advisor'
```

### `getBundle`

A function that will return the name of the current bundle:

```tsx
function getBundle(): string

// URL: https://ci.console.redhat.com/beta/insights/advisor/recommendations
getBundle() // => 'insights'
```

### `getEnvironment`

A function that will return the name of the current environment:

```tsx
function getEnvironment(): string

// URL: https://ci.console.redhat.com/beta/insights/advisor/recommendations
getEnvironment() // => 'ci'
// https://qa.console.redhat.com/beta/insights/advisor/recommendations
getEnvironment() // => 'qa'
// https://console.stage.redhat.com/beta/insights/advisor/recommendations
getEnvironment() // => 'stage'
// https://console.redhat.com/beta/insights/advisor/recommendations
getEnvironment() // => 'prod'
```

### `getUserPermissions`

A **promise** that returns an array of all user permissions of the current user.

```tsx
function getUserPermissions(
  app?: string /* Only permissions belonging to app will be returned, pass empty string to return all permissions */,
  bypassCache?: bool /* If true, results of this function will not be cached, defaults to false */
): Promise<{permissions: string; resourceDefinitions: object[]}[]>

getUserPermissions().then(console.log) // => [{permissions: 'foo:bar:baz', resourceDefinitions: []}, ...]
```

### `globalFilterScope`

Scopes global filter to a specific source.

```tsx
function globalFilterScope(scope: string): void

globalFilterScope('insights')  // => populate global filter with tags for systems only from insights source
```

### `hideGlobalFilter`

Function to toggle the global filter from the UI.

```tsx
function hideGlobalFilter(hide = true): void
```

### `identifyApp`

> NOTE: Applications are identified automatically based on the loaded module. To update the document title, use <a href="#updateDocumentTitle">updateDocumentTitle</a> API instead.

```tsx
function identifyApp(
  appName?: any /**Application name. ignored */,
  appTitle?: string /** New browser document title. */
)

identifyApp('advisor', 'Insights advisor')
```

### ~~`init`~~

Initialize chrome. Sets up the chrome API  and adds `data-ouia-safe` to the application root element.

### `isBeta`

A function that checks if the chrome is in the beta environment.

```tsx
function isBeta(): boolean
```

### `isChrome2`

A flag that signalizes if the current version of chrome is chrome 2

### `isPenTest`

A function that checks the browser cookies for `x-rh-insights-pentest` flag.

```tsx
function isPenTest(): boolean
```

### `isProd`

A flag that signalizes if the current environment is the production environment
### `mapGlobalFilter`

Transforms an object to a flat array of tags to `${namespace}/${key}=${value}` shape.

```tsx
/**
 * TO DO
 * Properly document the function API. Can't figure it out from the implementation
*/
function mapGlobalFilter(data: {Workloads, [SID_KEY]: object}, encode = false, format = false): string[]

mapGlobalFilter()
```

### ~~`navigation`~~
  
This function no longer has any purpose. Please, remove it from your code.


### `on`

Used to register listeners on specific chrome public events

```tsx
type publicEvent = 'APP_NAVIGATION' | 'NAVIGATION_TOGGLE' | 'GLOBAL_FILTER_UPDATE'

function on(type: publicEvent, callback: Function): void

interface navigationPayload {
  navId: string;
  domEvent: {
    href: string; // absolute link path
    id: string // action id
    navId: string // action id    
  }
}

on('APP_NAVIGATION', (data: navigationPayload) => void)

/**
 * TO DO: document the interface
*/
interface globalFilterUpdatePayload {

}

on('GLOBAL_FILTER_UPDATE', (data: globalFilterUpdatePayload) => void)

/**
 * @deprecated
*/
on('NAVIGATION_TOGGLE', () => void)
```

### `registerModule`


```tsx
function registerModule(module: string, manifestLocation: string): void

registerModule('newModule', '/apps/newModule/js/fed-modules.json')
```

### `updateDocumentTitle`

Function that updates the `document.title` property. Use to change the browser tab/window title.

```tsx
function updateDocumentTitle(title: string): void

updateDocumentTitle('New document title')
```

### `visibilityFunctions`

A set of methods to check if the current user has permissions. Visit the [visibility functions](/chrome/visibility-functions) section for more information.
