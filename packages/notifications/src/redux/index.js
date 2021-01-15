import * as types from './actions/action-types';
import * as reduxActions from './actions/notifications';

export const actions = reduxActions;
export const actionTypes = types;
export { default as notificationsReducer } from './reducers/notifications';
