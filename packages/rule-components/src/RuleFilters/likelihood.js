import { impactLabels, impactValues } from '../RuleTable/constants';
export default ({ onChange, value, ...props } = { onChange: () => undefined }) => ({
    ...props,
    label: 'Likelihood',
    value: 'likelihood',
    type: 'checkbox',
    filterValues: {
        value,
        onChange,
        items: [ ...new Array(impactValues.length) ].map((_item, key) => ({
            label: impactLabels[key],
            textual: impactLabels[key],
            value: impactValues[key]
        }
        ))
    }
});
