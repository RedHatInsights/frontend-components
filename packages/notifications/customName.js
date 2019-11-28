const mapper = {
    NotificationsPortal: 'NotificationPortal',
    notifications: 'redux',
    notificationsReducers: 'redux',
    ADD_NOTIFICATION: 'redux',
    REMOVE_NOTIFICATION: 'redux',
    CLEAR_NOTIFICATIONS: 'redux',
    addNotification: 'redux',
    removeNotification: 'redux',
    clearNotifications: 'redux'
};

module.exports = (name) => {
    return `@redhat-cloud-services/frontend-components-notifications/${mapper[name] || name}`;
};
