export { default as ChipBuilder } from './ChipBuilder';
export { default as FilterConfigBuilder, stringToId } from './FilterConfigBuilder';
export { default as buildFilterConfig, POLICIES_FILTER_CONFIG } from './FilterBuilderConfigBuilder';
export { toRulesArray } from './RulesHelper';
export { default as FilterBuilder } from './FilterBuilder';

const getSortable = (property, rule) => {
    switch (property) {
        case 'rule':
            return rule.title;
        case 'policy':
            return rule.policies[0].name;
        case 'severity':
            return rule.severity;
        case 'passed':
            return rule.compliant;
        case 'column-6':
            return rule.remediationAvailable;
        default:
            return rule.title;
    }
};

export const orderRuleArrayByProp = (property, objects, direction) => (
    objects.sort((a, b) => {
        if (direction === 'asc') {
            return String(getSortable(property, a)).localeCompare(String(getSortable(property, b)));
        } else {
            return -String(getSortable(property, a)).localeCompare(String(getSortable(property, b)));
        }
    })
);

export const orderByArray = (objectArray, orderProp, orderArray, direction) => (
    (direction !== 'asc' ? orderArray.reverse() : orderArray).flatMap((orderKey) => (
        objectArray.filter((item) => (item[orderProp] === orderKey))
    ))
);

