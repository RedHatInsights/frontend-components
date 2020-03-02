import { ruleStatusLabels, ruleStatusValues } from '../RuleTable/constants';
export default ({ onChange, value, ...props } = { onChange: () => undefined }) => ({
    ...props,
    label: 'Rule status',
    value: 'rule_status',
    type: 'radio',
    filterValues: {
        value,
        onChange,
        items: [ ...new Array(ruleStatusValues.length) ].map((_item, key) => ({
            label: ruleStatusLabels[key],
            textual: ruleStatusLabels[key],
            value: ruleStatusValues[key]
        }
        ))
    }
});
