export * from './useTextFilter';
export * from './useStalenessFilter';
export * from './useRegisteredWithFilter';
export * from './useTagsFilter';
export const filtersReducer = (reducersList) => (state, action) => reducersList.reduce((acc, curr) => ({
    ...acc,
    ...curr?.(state, action)
}), state);
