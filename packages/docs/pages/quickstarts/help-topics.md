import { Alert } from '@patternfly/react-core'

# Help topics

**Make sure you have done the [setup](/quickstarts/setup).**

you can directly use the `@patternfly/quickstarts` module to manage the help topics feature. Please follow the [official readme](https://github.com/patternfly/patternfly-quickstarts/tree/main/packages/module#in-app--in-context-help-panel).

## Adding a topic to the list

To add a new help topic content, use the chrome API.

This example shows how to add new topics to the quickstarts after a component is mounted for the first time.

<Alert className="pf-u-mt-md pf-u-mb-md" variant="info" title="Each topic can be added only once.">
  Topics are identified by the name attribute. A new topic with existing name will override the current topic.
</Alert>

```jsx
import React, { useEffect } from 'react';
import useChrome from '@redhat-cloud-services/frontend-components/use-chrome';

const SomeComponent = () => {
  const { helpTopics: { updateHelpTopics } } = useChrome()

  // load the help topics on demand
  useEffect(() => {
    updateHelpTopics(helpTopicOne, helpTopicTwo, ...)
  }, [])

  // your JSX
  return (
    <div>...</div>
  )
}
```
