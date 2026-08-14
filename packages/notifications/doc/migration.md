# Migration

## V5 to V6 migration

In version 6, the notifications package was decoupled from redux. The package now uses only React api to manage its state.

### Using notifications middleware and redux store

Replace `NotificationsPortal` component with `NotificationsProvider`

```diff
- <NotificationsPortal />
+ <NotificationsProvider />
# Provider can also render children
- <NotificationsPortal />
- {children}
+ <NotificationsProvider>
+  {children}
+ </NotificationsProvider>
```

Remove the notifications middleware from reducer from your store

```diff
- import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
- import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';

const middlewares = [
  thunk,
  promiseMiddleware,
-  notificationsMiddleware({
-    errorTitleKey: ['statusText', 'message', 'errors[0].status'],
-    errorDescriptionKey: ['errors[0].detail', 'errors', 'stack'],
-  }),
  reduxLogger,
].filter((middleware) => typeof middleware === 'function');
```

#### Notifications middleware

In v6, you can no longer dispatch automated notifications via redux middleware in combination with promise middleware. If you still need this functionality, you will have to implement your own middleware. You can take inspiration from the legacy version.

https://github.com/RedHatInsights/frontend-components/blob/pf4%405/packages/notifications/src/notificationsMiddleware/notificationsMiddleware.ts

In addition to custom integration, the internal notification store, has to be accessible from outside of the react context. You can create a store instance and pass it directly to your notifications provider. You can then use the store outside of react components.

```jsx
import { createStore } from '@redhat-cloud-services/frontend-components-notifications/state';

const store = createStore()

<NotificationsProvider store={store} />

// use the store in your middleware integration

const customMiddleware = api => next => action => {
  // handle the action
  if(action.type.includes('_REJECTED')) {
    store.addNotification({
      title: action.error.title,
      description: action.error.description,
      variant: 'danger',
    })
  }

  return next(action)
}
```
