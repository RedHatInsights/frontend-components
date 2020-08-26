import { conditionalFilterType } from '@redhat-cloud-services/frontend-components';
import FilterBuilder from './FilterBuilder';
import ChipBuilder from './ChipBuilder';

export const stringToId = (string) => (
    string.replace(' ', '').toLowerCase()
);

class FilterConfigBuilder {
    chipBuilder = null;
    filterBuilder = null;

    constructor(config) {
        this.config = config;
    }

    addConfigItem = (item) => (
        this.config = this.config.filter((i) => (
            i.label !== item.label
        )).concat(item)
    )

    getChipBuilder = () => (
        this.chipBuilder = this.chipBuilder ? this.chipBuilder : new ChipBuilder(this)
    )

    getFilterBuilder = () => (
        this.filterBuilder = this.filterBuilder ? this.filterBuilder : new FilterBuilder(this)
    )

    toTextFilterConfig = (item, handler, value) => ({
        type: conditionalFilterType.text,
        label: item.label,
        id: stringToId(item.label),
        filterValues: {
            value,
            [item.event || 'onChange']: (_event, selectedValues) => {
                handler(stringToId(item.label), selectedValues);
            }
        }
    });

    toCheckboxFilterConfig = (item, handler, value) => ({
        type: conditionalFilterType.checkbox,
        label: item.label,
        id: stringToId(item.label),
        filterValues: {
            value,
            items: item.items,
            onChange: (_event, selectedValues) => {
                handler(stringToId(item.label), selectedValues);
            }
        }
    });

    toRadioFilterConfig = (item, handler, value) => ({
        type: conditionalFilterType.radio,
        label: item.label,
        id: stringToId(item.label),
        filterValues: {
            value,
            items: item.items,
            onChange: (_event, selectedValues) => {
                handler(stringToId(item.label), selectedValues);
            }
        }
    });

    toFilterConfigItem = (item, handler, value) => {
        switch (item.type) {
            case conditionalFilterType.text:
                return this.toTextFilterConfig(item, handler, value);

            case conditionalFilterType.checkbox:
                return this.toCheckboxFilterConfig(item, handler, value);

            case conditionalFilterType.radio:
                return this.toRadioFilterConfig(item, handler, value);

            default:
                return null;
        }
    };

    buildConfiguration = (handler, states, props = {}) => ({
        ...props,
        items: this.config.map((item) => (
            this.toFilterConfigItem(item, handler, states[stringToId(item.label)])
        ))
    });

    defaultValueForFilter = (filter) => {
        switch (filter.type) {
            case conditionalFilterType.text:
                return '';
            case conditionalFilterType.checkbox:
                return [];
            default:
                return;
        }
    }

    initialDefaultState = (defaultStates = {}) => {
        let initialState = {};
        this.config.forEach((filter) => {
            const filterStateName = filter.label.replace(' ', '').toLowerCase();
            initialState[filterStateName] =
                defaultStates[filterStateName] || this.defaultValueForFilter(filter);
        });
        return initialState;
    }

    categoryLabelForValue = (value) => {
        const category = this.config.filter((category) => (
            category.items ? category.items.map((item) => item.value).includes(value) : false
        ))[0];

        return category ? category.label : value;
    };

    getCategoryForLabel = (query) => (
        this.config.filter((item) => (stringToId(item.label) === stringToId(query)))[0] || {}
    )

    getItemByLabelOrValue = (query, category) => {
        const items = this.getCategoryForLabel(category).items;
        const results = (items || []).filter((item) => (
            item.value === query || item.label === query
        ));

        if (results.length === 1) {
            return results[0];
        } else if (results.length > 1) {
            // eslint-disable-next-line no-console
            console.info(`Multiple items found for ${query} in ${category}! Returning first one.`);
            return results[0];
        } else {
            // eslint-disable-next-line no-console
            console.info('No item found for ' + query + ' in ', category);
        }
    }

    labelForValue = (value, category) => {
        const item = this.getItemByLabelOrValue(value, category);
        return item ? item.label : value;
    };

    valueForLabel = (label, category) => {
        const item = this.getItemByLabelOrValue(label, category);
        return item ? item.value : label;
    };

    applyFilterToObjectArray = (objects, activeFilters) => {
        let filteredObjects = [ ...objects ];
        Object.keys(activeFilters).forEach((filter) => {
            const category = this.getCategoryForLabel(filter);
            const value = activeFilters[filter];
            if (!category || !value) {
                return;
            }

            if (value.length > 0) {
                filteredObjects = category.filter(filteredObjects, value);
            }
        });

        return filteredObjects;
    }

    removeFilterFromFilterState = (currentState, filter) => (
        (typeof(currentState) === 'string') ? '' :
            currentState.filter((value) =>
                value !== filter
            )
    )

    removeFilterWithChip = (chips, activeFilters) => {
        const chipCategory = chips.category;
        const chipValue = this.valueForLabel(chips.chips[0].name, chipCategory);
        const stateProp = stringToId(chipCategory);
        const currentState = activeFilters[stateProp];
        const newFilterState = this.removeFilterFromFilterState(currentState, chipValue);

        return {
            ...activeFilters,
            [stateProp]: newFilterState
        };
    }
}

export default FilterConfigBuilder;
