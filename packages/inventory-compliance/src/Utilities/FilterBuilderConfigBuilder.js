import { HIGH_SEVERITY, MEDIUM_SEVERITY, LOW_SEVERITY, UNKNOWN_SEVERITY } from '../Constants';
import {
    conditionalFilterType
} from '@redhat-cloud-services/frontend-components/ConditionalFilter';

const filterRulesWithAllValues = (rules, values, valueCheck) => rules.filter((rule) => (
    values.map((value) => valueCheck(rule, value)).filter(v => !!v).length > 0
));

const anyFilterApply = (rules, values, valueCheck) => {
    let filteredRules = [];
    rules.forEach((rule) => {
        if (values.map((value) => valueCheck(rule, value)).filter(v => !!v).length > 0) {
            filteredRules.push(rule);
        }
    });
    return filteredRules;
};

const BASE_FILTER_CONFIGURATION = [
    {
        type: conditionalFilterType.text,
        label: 'Name',
        filter: (rules, value) => filterRulesWithAllValues(rules, [ value ], (rule, value) => (
            rule.title.toLowerCase().includes(value.toLowerCase()) ||
            (rule.identifier && rule.identifier.label.toLowerCase().includes(value.toLowerCase())) ||
            rule.references.filter((reference) => reference.label.toLowerCase().includes(value.toLowerCase())).length > 0
        ))
    },
    {
        type: conditionalFilterType.checkbox,
        label: 'Severity',
        items: [
            { label: HIGH_SEVERITY, value: 'high' },
            { label: MEDIUM_SEVERITY, value: 'medium' },
            { label: LOW_SEVERITY, value: 'low' },
            { label: UNKNOWN_SEVERITY, value: 'unknown' }
        ],
        filter: (rules, values) => anyFilterApply(rules, values, (rule, value) => (
            rule.severity === value
        ))
    }
];

const PASS_FILTER_CONFIG = {
    type: conditionalFilterType.radio,
    label: 'Passed',
    items: [
        { label: 'Show passed rules', value: 'passed' },
        { label: 'Hide passed rules', value: 'failed' }
    ],
    filter: (rules, value) => rules.filter((rule) => (
        rule.compliant === (value === 'passed')
    ))
};

export const POLICIES_FILTER_CONFIG = (policies) => ({
    type: conditionalFilterType.checkbox,
    label: 'Policy',
    items: policies.map(policy => (
        { label: policy.name, value: policy.id }
    )),
    filter: (rules, values) => filterRulesWithAllValues(rules, values, (rule, value) => (
        rule.profiles.filter((profile) => profile.policy.id === value).length > 0
    ))
});

export const REMEDIATION_AVAILABLE_FILTER_CONFIG = {
    type: conditionalFilterType.checkbox,
    label: 'Remediation available',
    items: [
        { label: 'Remediation available', value: 'true' }
    ],
    filter: (rules, value) => rules.filter(rule => rule.remediationAvailable)
};

const buildFilterConfig = ({ showPassFailFilter, policies, remediationAvailableFilter }) => {
    const config = [ ...BASE_FILTER_CONFIGURATION ];

    if (showPassFailFilter) {
        config.push(PASS_FILTER_CONFIG);
    }

    if (policies && policies.length > 1) {
        config.push(POLICIES_FILTER_CONFIG(policies));
    }

    if (remediationAvailableFilter) {
        config.push(REMEDIATION_AVAILABLE_FILTER_CONFIG);
    }

    return config;
};

export default buildFilterConfig;
