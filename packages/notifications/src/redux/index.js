import * as types from './action-types';
import * as reduxActions from './actions/notifications';

export const actions = reduxActions;
export const actionTypes = types;
export { default as notificationsReducers } from './reducers/notifications';
