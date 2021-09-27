import React from 'react';
import ReactDOM from 'react-dom';

import { Provider, useDispatch } from 'react-redux';
import NotificationPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import { notificationsReducer, notificationActions } from '@redhat-cloud-services/frontend-components-notifications/redux';
import ReducerRegistry from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';

const App = () => {
    const dispatch = useDispatch();
    const handleClick = () => {
        dispatch({ type: 'prd' });
        dispatch(notificationActions.addNotification({
            variant: 'success',
            title: 'foo'
        }));
    };

    return (
        <button onClick={handleClick}>Click me</button>
    );
};

const registry = new ReducerRegistry({}, [
    notificationsMiddleware({
        errorTitleKey: [ 'message' ],
        errorDescriptionKey: [ 'errors', 'stack' ]
    })
]);

registry.register({
    notifications: notificationsReducer
});

const store = registry.getStore();

const MyCmp = () => {
    return (
        <Provider store={store}>
            <NotificationPortal />
            <App />
        </Provider>
    );
};

ReactDOM.render(<MyCmp />, document.querySelector('.demo-app'));
