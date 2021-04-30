import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { stringToId } from './Helpers';

class FilterBuilder {
    constructor(filterConfig) {
        this.filterConfig = filterConfig;
        this.config = this.filterConfig.config;
    }

    buildFilterFilterString = (configItem, value) => {
        const { type, filterString } = configItem;

        if (type !== 'hidden' && !value) { return []; }

        switch (type) {
            case conditionalFilterType.text:
                return [ filterString(value) ];
            case conditionalFilterType.checkbox:
                return value.map((filter) => (filterString(filter)));

            case conditionalFilterType.group:
                return filterString(value);

            case 'hidden':
                return filterString();

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
