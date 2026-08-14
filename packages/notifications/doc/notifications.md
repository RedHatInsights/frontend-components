# Notifications

> This doc is for version 6. If you want to migrate to v6 check the [migration doc](./migration.md).
If you want the old documentation [check this link](https://github.com/RedHatInsights/frontend-components/blob/pf4%405/packages/notifications/doc/notifications.md).

This is a global notifications component, with defined PF styling.

## Basic notifications usage

Add `NotificationsProvider` component to the top of your application

```JSX
import React, { Fragment } from 'react'
import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';


const App = () => (
  <NotificationsProvider>
    <Component />
  </NotificationsProvider>
)
```

To add notifications, you can call `useAddNotification` hook to add a function to add new notification.

```JSX
import React from 'react';
import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks';

const MagicButton = ({ addNotification }) => {
  const addNotification = useAddNotification()
  return (
    <button
        onClick={() => addNotification({
          variant: 'success',
          title: 'Notification title',
          description: 'notification description'
        })}
    >
      Add notification
    </button>
  )
}

export default MagicButton

```

## Notification options
Visuals for notifications are defined by Patternfly-4. You can check the [patternfly-react#alert](https://www.patternfly.org/components/alert).
We provide additional options, that can help you control your notifications
```javascript
{
  title: string,
  variant: ['success', 'danger', 'info', 'warning'],
  description: node?
  dismissable: bool? // if is false, notification will not have the dismiss button,
  dismissDelay: number? // time period after which alert disappears in ms. Default value is 8000
  autoDismiss: bool? // true by default, if set to false, notification will not automatically disapear after dismissDelay
}
```

### Notifications state API

There are 3 supported API functions for notifications:
- addNotifications: adds new notification
- removeNotification: removes notifications. It requires notification ID
- clearNotifications: removes all notifications

in most of the cases you should be fine with just `addNotification` and `clearNotifications`. We advise not to use `removeNotification` and use default behaviour.

```jsx
import { useNotifications } from '@redhat-cloud-services/frontend-components-notifications/hooks';

const Cmp = () => {
  const { addNotification, removeNotification, clearNotifications, notifications } = useNotifications();

  return (
    ...
  )
}
```

### using notifications store outside of React context

In case you need to access the notifications API outside a React component,  you can create a custom notification store and cal it in any JS code. In order to link this custom store and your React components, this custom store has to be passed a prop to your `NotificationsProvider`.

```jsx
import { createStore } from '@redhat-cloud-services/frontend-components-notifications/state';
import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks';

const store = createStore()

const Child = () => {
  const addNotification = useAddNotification()

  return (
    <button onClick={() => {
      // call from React context
      addNotification({
        // ...
      })
      // call directly the store
      store.addNotification({
        // ...
      })
    }}>Add notification</button>
  )
}

const AppRoot = () => {
  return (
    <NotificationsProvider store={store}>
      <Child />
    </NotificationsProvider>
  )
}
```

## Testing setup

This package uses the [`crypto`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto) Api to generate IDs for the notification items. Some environments, including JSDom use for jest testing might not include this API. You can mock it in your jest setup test file:

```js
const crypto = require('crypto');

// Crypto object polyfill for JSDOM
global.window.crypto = {
  ...crypto,
}
// in case the crypto package is mangled or the method does not exist
if(!global.window.crypto.randomUUID) {
  global.window.crypto.randomUUID = () => Date.now().toString(36) + Math.random().toString(36).slice(2);
}
```

The format of the return value is not important. It has to be unique.
