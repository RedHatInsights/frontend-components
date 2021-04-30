import { useState, useLayoutEffect } from 'react';
import FilterConfigBuilder from './FilterConfigBuilder/FilterConfigBuilder';

const filterConfigBuilder = new FilterConfigBuilder([]);

const useFilterConfig = (initialConfig) => {
    const [ activeFilters, setActiveFilters ] = useState(filterConfigBuilder.initialDefaultState(
        initialConfig?.activeFilters || []
    ));
    const onFilterUpdate = (filter, value) => (
        setActiveFilters({
            ...activeFilters,
            [filter]: value
        })
    );

    const buildConfig = () => (
        filterConfigBuilder.buildConfiguration(
            onFilterUpdate,
            activeFilters
        )
    );

    const addConfigItem = (item) => {
        filterConfigBuilder.addConfigItem(item);
    };

    const clearAllFilter = () => (
        setActiveFilters(filterConfigBuilder.initialDefaultState())
    );

    const deleteFilter = (chips) => (
        setActiveFilters(filterConfigBuilder.removeFilterWithChip(
            chips, activeFilters
        ))
    );
    const onFilterDelete = (_event, chips, clearAll = false) => (
        clearAll ? clearAllFilter() : deleteFilter(chips[0])
    );
    const chipBuilder = filterConfigBuilder.getChipBuilder();
    const filterChips = chipBuilder.chipsFor(activeFilters);

    useLayoutEffect(() => {
        initialConfig.forEach(addConfigItem);
    }, []);

    return {
        filter: (items) => (
            filterConfigBuilder.applyFilterToObjectArray(
                items, activeFilters
            )
        ),
        toolbarProps: {
            filterConfig: buildConfig(),
            activeFiltersConfig: {
                filters: filterChips,
                onDelete: onFilterDelete
            }
        },
        addConfigItem,
        filterConfigBuilder,
        activeFilters,
        buildFilterString: () => filterConfigBuilder.getFilterBuilder().buildFilterString(activeFilters)
    };
};

export default useFilterConfig;
