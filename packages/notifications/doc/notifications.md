# Notifications

This is a global notifications component, with defined PF4 styling. Notifications are controlled via Redux. There is also a redux middleware, that includes for custom async actions notifications.

## Basic notifications usage

Add `NotificationsPortal` component and add `notifications` reducer to your store (in the example below is used the insings redux registry).

```JSX
import React, { Fragment } from 'react'
import { Provider } from 'react-redux'
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationsPortal';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';

const registry = getRegistry()
registry.register({ notifications: notificationsReducer })

const App = () => (
  <Provider store={registry.getStore()}>
    <Fragment>
        <NotificationsPortal />
    </Fragment>
  </Provider>
)
```

To add notifications, you can simply dispatch `addNotification` action somewhere in your app.

```JSX
import React from 'react';
import { useDispatch } from 'react-redux'
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';

const MagicButton = ({ addNotification }) => {
  const dispatch = useDispatch()
  return (
    <button
        onClick={() => dispatch(addNotification({
          variant: 'success',
          title: 'Notification title',
          description: 'notification description'
        }))}
    >
      Add notification
    </button>
  )
}

export default MagicButton

```

## Notification options
Visuals for notifications are defined by Patternfly-4. You can check the [patternfly-react#alert](http://patternfly-react.surge.sh/patternfly-4/components/alert).
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

### Notifications actions

There are 3 supported actions for notifications:
- addNotifications: adds new notification
- removeNotification: removes notifications. It requires notification ID
- clearNotifications: removes all notifications

in most of the cases you should be fine with just `addNotification` and `clearNotifications`. We advise not to use `removeNotification` and use default behaviour.

```javascript
import { addNotification, removeNotification, clearNotificationsaddNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
```

You can also acces the action types for these actions.
```javascript
import { ADD_NOTIFICATION, REMOVE_NOTIFICATION, CLEAR_NOTIFICATIONS } from '@redhat-cloud-services/frontend-components-notifications/redux';
```

## Notifications middleware
We also support automatic notifications control for redux async actions. Insights are using [redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware) for async actions, so the middleware is built for that, but can be modified.

Promise middleware adds 3 stages for each async action:
```javascript
type: 'FOO_PENDING',
type: 'FOO_FULFILLED',
type: 'FOO_REJECTED'
```

Notifications middleware is checking actions for these suffixes and if defined, it will create a notification.

### Configuration.
Like in the basic example, you must add your reducer and notifications container. On to of that, you must add the middleware to your store:

```JSX
import promiseMiddleware from 'redux-promise-middleware'
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import notificationsReducer from '@redhat-cloud-services/frontend-components-notifications/redux';

const registry = getRegistry({}, [promiseMiddleware(), notificationsMiddleware()]);
registry.register({ notifications: notificationsReducer })

// rest of the config is the same as in basic example

```

Note: make sure that you add the notifications middleware after the promise middleware. Order does matter! That is how redux middleware works.

After this, the middleware will automatically dispatch actions, if your promise is rejected.

### Define notifications for actions

Now you can add additional informations to your actions, where you can define what notification will show, per action stage.

You can add meta object with notifications property. In there you define your notifications. Notification object has the same attributes as in examplse above.

```javascript
export const asyncAction = data => ({
  type: 'FOO',
  payload: asyncHandler(data) // this function must return promise
  meta: {
    notifications: {
      pending: {
        variant: 'info',
        title: 'Request is pending',
      },
      fulfilled: {
        variant: 'success',
        title: 'Request is done',
      },
      rejected: {
        variant: 'danger',
        title: 'Request has failed',
      },
    }
  }
})
```

As you can see, you have 3 action stages avaiable:

- pending
  - this notification is send right after you create the request
- fulfilled
  - this one si created once the promise is resolved
- rejected
  - this one si created if the promise is rejected
  - overrides the default error notification

All of these are optional. You can use none, or all of them.

### Customization

There are several configuration options, that will apply on all notifications (can be ovveriden in action definition).

Configuration options:

```javascript
defaultOptions = {
  dispatchDefaultFailure: true, // automatic error notifications
  pendingSuffix: '_PENDING', // pending state action suffix
  fulfilledSuffix: '_FULFILLED', // fulfilled state action suffix
  rejectedSuffix: '_REJECTED', // rejected state action suffix
  autoDismiss: true,  // autoDismiss pending and success notifications
  dismissDelay: 5000,  // autoDismiss delay in ms
  errorTitleKey: 'title', // path to notification title in error response
  errorDescriptionKey: 'detail' // path to notification description in error response
}

const registry = new ReducerRegistry({}, [..., notificationsMiddleware({...defaultOptions})]);

```

**Some useful options**

1. Turning off automatic error notifications
This will turn of error notifications globally. But you can still define error notification in async action.

```javascript
notificationsMiddleware({ dispatchDefaultFailure: false })
```

2. Turn off error notification only for specific action, you can do following:

```javascript
// some async action
export const asyncAction = data => ({
  type: 'FOO',
  payload: asyncHandler(data) // this function must return promise
  meta: {
    noError: true, // turns of automatic notification
    notifications: {
      fulfilled: {
        variant: 'success',
        title: 'Request is done',
      },
    }
  }
})
```

Note that if use noError: true flag, custom error notification will be still dispatched if defined.

2. Specify text of automatic error notification.

Currently there is no unified format for error API responses (there is a candidate: https://jsonapi.org/format/#fetching-pagination, but that can change).So you can specify, where is your error title and description.


Lets say we have this response format:

```javascript
// error response format
{
  body: {
    heading: 'Some error title',
    description: 'Some error description'
  }
}
```
We can configure middleware to accept it:

```javascript
notificationsMiddleware({
  errorTitleKey: 'body.heading',
  errorDescriptionKey: 'body.description',
})
```


There might be also an situation when different APIs returns different error responses. You can configure multiple key paths to your error message.

Lets say that our two endpoints have different error response structures:

```javascript
// Endpoint A
{
  errorTitle: 'Error',
  errorDescription: 'Description'
}
// Endpoint B
{
  error: {
    title: 'Error',
    description: 'Description'
  }
}
```

We can tell the middleware that it should look for different keys in response:

```javascript
notificationsMiddleware({
  errorTitleKey: ['errorTitle', 'error.title'],
  errorDescriptionKey: ['errorDescription', 'error.description'],
})
```

If you happen to have an error response that matches more paths, the first match will be chosen (order is equal to the order of items in array).


