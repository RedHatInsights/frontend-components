const asyncInventory = [
    'LOAD_ENTITIES',
    'LOAD_ENTITY',
    'LOAD_SYSTEM_PROFILE',
    'SET_DISPLAY_NAME',
    'SET_ANSIBLE_HOST'
].reduce((acc, curr) => [
    ... acc,
    ...[ curr, `${curr}_PENDING`, `${curr}_FULFILLED`, `${curr}_REJECTED` ]
], []);

export const INVENTORY_ACTION_TYPES = [
    ...asyncInventory
]
.reduce((acc, curr) => {
    acc[curr] = curr;
    return acc;
},
{}
);

export const ACTION_TYPES = [
    ...asyncInventory
]
.reduce((acc, curr) => {
    acc[curr] = curr;
    return acc;
},
{}
);

export const UPDATE_ENTITIES = 'UPDATE_ENTITIES';
export const SELECT_ENTITY = 'SELECT_ENTITY';
export const CHANGE_SORT = 'CHANGE_SORT';
export const FILTER_ENTITIES = 'FILTER_ENTITIES';
export const APPLICATION_SELECTED = 'APPLICATION_SELECTED';
export const SHOW_ENTITIES = 'SHOW_ENTITIES';
export const FILTER_SELECT = 'FILTER_SELECT';
export const ENTITIES_LOADING = 'ENTITIES_LOADING';
export const CLEAR_FILTERS = 'CLEAR_FILTERS';

/**
 * Notifications actions
 */
const notificationsPrefix = '@@INSIGHTS-CORE/NOTIFICATIONS/';
export const ADD_NOTIFICATION = `${notificationsPrefix}ADD_NOTIFICATION`;
export const REMOVE_NOTIFICATION = `${notificationsPrefix}REMOVE_NOTIFICATION`;
export const CLEAR_NOTIFICATIONS = `${notificationsPrefix}CLEAR_NOTIFICATIONS`;

/**
 * Application actions
 */
export const CVE_FETCH_LIST = 'CVE_FETCH_LIST';
export const SYSTEM_CVE_STATUS_LIST = 'SYSTEM_CVE_STATUS_LIST';
