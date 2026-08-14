# Help topics

**Make sure you have done the [setup](/quickstarts/setup).**

You can directly use the `@patternfly/quickstarts` module to manage the help topics feature. Please follow the [official readme](https://github.com/patternfly/patternfly-quickstarts/tree/main/packages/module#in-app--in-context-help-panel).

## Help topics chrome API

The help topics API can be accessed trough the `useChrome` hook;

```jsx
// A react component
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const ReactComponent = () => {
  const {
    helpTopics: {
      addHelpTopics,
      enableTopics,
      disableTopics,
      setActiveTopic,
      closeHelpTopic
    }
  } = useChrome()

  return (
    <div>
      ...
    </div>
  )
}

```

### `addHelpTopics`

*function*

Add new help topic(s) to the chrome state.

```ts
function addHelpTopics(topics: HelpTopic[], enabled?: boolean): void

/**
 * Usage
 */
addHelpTopics(helpTopicOne, helpTopicTwo, ...)

```

### `enableTopics`

*function*

Make help topics as enabled. Enabled help topics will passed to the `HelpTopicsContainer` and will be available for rendering.

If one or more help topics are not present in the chrome store, chrome will try to fetch it from the quickstarts API.

```ts
async function enableTopics(...topicsNames: string[]): Promise

/**
 * Usage
 */
enableTopics('topic-name-1', 'topic-name-2', ...)

```

### `disableTopics`

*function*

Disable help topics. Disabled help topic can't be activated.

```ts
function disableTopics(...topicsNames: string[]): void

/**
 * Usage
 */
disableTopics('topic-name-1', 'topic-name-2', ...)


```

### `setActiveTopic`

*function*

Activates a help topic (opens the help topic drawer).

If a requested help topic is not present in the chrome store, the chrome will try to fetch it from the quickstarts API.

```ts
function setActiveTopic(name): void

/**
 * Usage
 */
setActiveTopic('topic-name')

```

### `closeHelpTopic`

*function*

Closes the help topic drawer. Clears any currently active topic.

```ts
function closeHelpTopic(): void

/**
 * Usage
 */
closeHelpTopic()
```

## In-app example

[Working example](https://github.com/RedHatInsights/insights-rbac-ui/pull/1091/files).

```jsx
import React from 'react';

import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const ComponenttWithHelpTopic = () => {
    const {
    helpTopics: { setActiveTopic },
  } = useChrome();

  // workspace is a testing help topic in the quickstarts API
  return (
    <div>
      <button onClick={() => setActiveTopic('workspace')}>Activate help topic</button>
    </div>
  )
}

```

## Adding help topics content to the quickstarts API

Please follow [this guide](https://github.com/RedHatInsights/quickstarts/blob/main/docs/help-topics/README.md).

## Getting help topics content from the quickstarts API

Please follow [this guide](https://github.com/RedHatInsights/quickstarts/blob/main/docs/help-topics/README.md#querying-help-topics).