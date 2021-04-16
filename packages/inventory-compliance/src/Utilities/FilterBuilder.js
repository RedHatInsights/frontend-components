import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import {
    stringToId
} from './Helpers';

class FilterBuilder {
    constructor(filterConfig) {
        this.filterConfig = filterConfig;
        this.config = this.filterConfig.config;
    }

    buildFilterFilterString = (configItem, value) => {
        if (!value) { return []; }

        const { type, filterString } = configItem;

        switch (type) {
            case conditionalFilterType.text:
                return [ filterString(value) ];
            case conditionalFilterType.checkbox:
                return value.map((filter) => (filterString(filter)));
            case conditionalFilterType.group:
                return filterString(value);

            default:
                return [];
        }
    }

    combineFilterStrings = (filterStringArray) => {
        const moreThanTwo = filterStringArray.map((f) => (f.length)).filter((fl) => (fl > 0)).length >= 2;
        return filterStringArray.map((fs) => (fs.join(' or '))).join(moreThanTwo ? ' and ' : '');
    }

    buildFilterString = (filters) => {
        const filterStringArray = this.config.map((configItem) => (
            this.buildFilterFilterString(configItem, filters[stringToId(configItem.label)])
        )).filter((f) => (f.length > 0));
        return this.combineFilterStrings(filterStringArray);
    }
}

export default FilterBuilder;
