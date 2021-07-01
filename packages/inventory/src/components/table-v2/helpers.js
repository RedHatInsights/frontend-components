export const getEnabledFilters = (hideFilters = {}) => ({
    name: !(hideFilters.all && hideFilters.name !== false) && !hideFilters.name,
    stale: !(hideFilters.all && hideFilters.stale !== false) && !hideFilters.stale,
    registeredWith: !(hideFilters.all && hideFilters.registeredWith !== false) && !hideFilters.registeredWith,
    tags: !(hideFilters.all && hideFilters.tags !== false) && !hideFilters.tags
});
