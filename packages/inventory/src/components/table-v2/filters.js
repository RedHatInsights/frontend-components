import { registered, REGISTERED_CHIP, staleness, STALE_CHIP, TEXTUAL_CHIP } from '../../shared';

const textFilter = (value, onChange) => ({
    label: 'Name',
    value: 'name-filter',
    filterValues: {
        placeholder: 'Filter by name',
        value,
        onChange: (_e, value) => onChange('name', value)
    }
});

const textChipFormatter = (value) => ({
    category: 'Display name',
    type: TEXTUAL_CHIP,
    chips: [
        { name: value }
    ]
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

const stalenessChipFormatter = (stalenessValue) => ({
    category: 'Status',
    type: STALE_CHIP,
    chips: staleness.filter(({ value }) => stalenessValue.includes(value))
    .map(({ label, ...props }) => ({ name: label, ...props }))
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

const registeredWithChipFormatter = (registeredWithValue) => ({
    category: 'Source',
    type: REGISTERED_CHIP,
    chips: registered.filter(({ value }) => registeredWithValue.includes(value))
    .map(({ label, ...props }) => ({ name: label, ...props }))
});

export const generateFilters = (enabledFilters, customFilters, filter, onChange) => ({ items: [
    ...(enabledFilters.name ? [ textFilter(filter.name, onChange) ] : []),
    ...(enabledFilters.stale ? [ stalenessFilter(filter.stale, onChange) ] : []),
    ...(enabledFilters.registeredWith ? [ registeredWithFilter(filter.registeredWith, onChange) ] : [])
    //...(enabledFilters.tagsFilter ? [tagsFilter] : []),
] });

const formatters = {
    name: textChipFormatter,
    stale: stalenessChipFormatter,
    registeredWith: registeredWithChipFormatter
};

export const generateChips = (filters) => Object.keys(filters).map((filter) =>
    (filters[filter] && !(Array.isArray(filters[filter]) && filters[filter].length === 0))
    && formatters[filter](filters[filter]))
.filter(Boolean);
