import { incidentRulesLabels, incidentRulesValues } from '../RuleTable/constants';
export default ({ onChange, value, ...props } = { onChange: () => undefined }) => ({
    ...props,
    label: 'Incident rules',
    value: 'incident_rules',
    type: 'checkbox',
    filterValues: {
        value,
        onChange,
        items: incidentRulesValues.map((_item, key) => ({
            label: incidentRulesLabels[key],
            textual: incidentRulesLabels[key],
            value: incidentRulesValues[key]
        }
        ))
    }
});
