
import get from 'lodash/get';
import has from 'lodash/has';
import { addNotification } from '../../redux/actions/notifications';

const prepareErrorMessage = (payload, errorTitleKey, errorDescriptionKey) => {
    if (typeof payload === 'string') {
        return {
            title: 'Error',
            description: payload
        };
    }

    let titleKey = errorTitleKey;
    if (Array.isArray(errorTitleKey)) {
        titleKey = errorTitleKey.find(key => has(payload, key));
    }

    let descriptionKey = errorDescriptionKey;
    if (Array.isArray(errorDescriptionKey)) {
        descriptionKey = errorDescriptionKey.find(key => has(payload, key));
    }

    return { title: get(payload, titleKey) || 'Error', description: get(payload, descriptionKey) };
};

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
        autoDismiss: false,
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
            dispatch(addNotification({
                variant: 'danger',
                dismissable: true,
                ...prepareErrorMessage(action.payload, middlewareOptions.errorTitleKey, middlewareOptions.errorDescriptionKey)
            }));
        }

        next(action);
    };

};

export default createNotificationsMiddleware;
