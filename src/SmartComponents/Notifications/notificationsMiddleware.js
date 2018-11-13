
import get from 'lodash/get';
import { addNotification } from '../../redux/actions/notifications';

const shouldDispatchDefaultError = ({
    isRejected,
    hasCustomNotification,
    noErrorOverride,
    dispatchDefaultFailure
}) => isRejected && !hasCustomNotification && !noErrorOverride && dispatchDefaultFailure;

const createNotificationsMiddleware = (options = {}) => {
    const defaultOptions = {
        dispatchDefaultFailure: true,
        pendingSuffix: '_PENDING',
        fulfilledSuffix: '_FULFILLED',
        rejectedSuffix: '_REJECTED',
        autoDismiss: true,
        dismissDelay: 5000,
        errorTitleKey: 'title',
        errorDescriptionKey: 'detail'
    };
    const middlewareOptions = { ...defaultOptions, ...options };

    const matchPending = type => type.match(new RegExp(`^.*${middlewareOptions.pendingSuffix}$`));
    const matchFulfilled = type => type.match(new RegExp(`^.*${middlewareOptions.fulfilledSuffix}$`));
    const matchRejected = type => type.match(new RegExp(`^.*${middlewareOptions.rejectedSuffix}$`));

    const defaultNotificationOptions = {
        dismissable: !middlewareOptions.autoDismiss,
        dismissDelay: middlewareOptions.dismissDelay
    };

    return ({ dispatch }) => next => action => {
        const { meta, type } = action;
        if (meta && meta.notifications) {
            const { notifications } = meta;
            if (matchPending(type) && notifications.pending) {
                dispatch(addNotification({ ...defaultNotificationOptions, ...notifications.pending }));
            } else if (matchFulfilled(type) && notifications.fulfilled) {
                dispatch(addNotification({ ...defaultNotificationOptions, ...notifications.fulfilled }));
            } else if (matchRejected(type) && notifications.rejected) {
                dispatch(addNotification({ ...defaultNotificationOptions, ...notifications.rejected }));
            }
        }

        if (shouldDispatchDefaultError({
            isRejected: matchRejected(type),
            hasCustomNotification: meta && meta.notifications && meta.notifications.rejected,
            noErrorOverride: meta && meta.noError,
            dispatchDefaultFailure: middlewareOptions.dispatchDefaultFailure
        })) {
            const title = get(action.payload, middlewareOptions.errorTitleKey) || 'Error';
            const description = typeof payload === 'string' ? action.payload : get(action.payload, middlewareOptions.errorDescriptionKey);
            dispatch(addNotification({
                variant: 'danger',
                title,
                description,
                dismissable: true
            }));
        }

        next(action);
    };

};

export default createNotificationsMiddleware;
