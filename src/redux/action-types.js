const asyncInventory = [
    'LOAD_ENTITIES',
    'LOAD_ENTITY'
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

export const SELECT_ENTITY = 'SELECT_ENTITY';
export const CHANGE_SORT = 'CHANGE_SORT';
export const FILTER_ENTITIES = 'FILTER_ENTITIES';
export const APPLICATION_SELECTED = 'APPLICATION_SELECTED';
export const SHOW_ENTITIES = 'SHOW_ENTITIES';

/**
 * Notifications actions
 */
const notificationsPrefix = '@@INSIGHTS-CORE/NOTIFICATIONS/';
export const ADD_NOTIFICATION = `${notificationsPrefix}ADD_NOTIFICATION`;
export const REMOVE_NOTIFICATION = `${notificationsPrefix}REMOVE_NOTIFICATION`;
export const CLEAR_NOTIFICATIONS = `${notificationsPrefix}CLEAR_NOTIFICATIONS`;
