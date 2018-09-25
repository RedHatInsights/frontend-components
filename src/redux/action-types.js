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
