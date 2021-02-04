import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';

class ChipBuilder {
    constructor(filterConfig) {
        this.filterConfig = filterConfig;
        this.config = this.filterConfig.config;
    }

    textFilterChip = (category, currentValue) => (currentValue && currentValue !== '' ? {
        category,
        chips: [{ name: currentValue }]
    } : null)

    checkboxFilterChip = (category, currentValue) => (currentValue && currentValue.length > 0 ? {
        category,
        chips: currentValue.map((value) => (
            { name: this.filterConfig.labelForValue(value, category) }
        ))
    } : null)

    radioFilterChip = (category, currentValue) => (currentValue && currentValue !== '' ? {
        category,
        chips: [{ name: this.filterConfig.labelForValue(currentValue, category) }]
    } : null)

    chipFor = (filter, currentValue) => {
        const categoryConfig = this.filterConfig.getCategoryForLabel(filter);
        const { label, type } = categoryConfig ? categoryConfig : { label: filter, type: null };

        switch (type) {
            case conditionalFilterType.text:
                return this.textFilterChip(label, currentValue);

            case conditionalFilterType.checkbox:
                return this.checkboxFilterChip(label, currentValue);

            case conditionalFilterType.radio:
                return this.radioFilterChip(label, currentValue);

            default:
                return null;
        }
    }

    chipsFor = (filters) => (
        Object.keys(filters).map((filter) => (
            this.chipFor(filter, filters[filter])
        )).filter((f) => (!!f))
    )
}

export default ChipBuilder;
