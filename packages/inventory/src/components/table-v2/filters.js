import { registered, staleness } from '../../shared';

const textFilter = (value, onChange) => ({
    label: 'Name',
    value: 'name-filter',
    filterValues: {
        placeholder: 'Filter by name',
        value,
        onChange: (_e, value) => onChange('name', value)
    }
});

const stalenessFilter = (value, onChange) => ({
    label: 'Status',
    value: 'stale-status',
    type: 'checkbox',
    filterValues: {
        value: value,
        onChange: (_e, value) => onChange('stale', value),
        items: staleness
    }
});

const registeredWithFilter = (value, onChange) => ({
    label: 'Source',
    value: 'source-registered-with',
    type: 'checkbox',
    filterValues: {
        value: value,
        onChange: (_e, value) => onChange('registeredWith', value),
        items: registered
    }
});

const tagsFilter = (value, onChange) => ({
    label: 'Source',
    value: 'source-registered-with',
    type: 'checkbox',
    filterValues: {
        value: value,
        onChange: (_e, value) => onChange(value),
        items: registered
    }
});

const generateFilters = (enabledFilters, customFilters, filter, onChange, textFilters, updateTextFilter) => ({ items: [
    ...(enabledFilters.name ? [ textFilter(textFilters.name, updateTextFilter) ] : []),
    ...(enabledFilters.stale ? [ stalenessFilter(filter.stale, onChange) ] : []),
    ...(enabledFilters.registeredWith ? [ registeredWithFilter(filter.registeredWith, onChange) ] : [])
    //...(enabledFilters.tagsFilter ? [tagsFilter] : []),
] });

export default generateFilters;
