import { impact } from '../RuleTable/constants';
export default ({ onChange, value, ...props } = { onChange: () => undefined }) => ({
    ...props,
    label: 'Likelihood',
    value: 'likelihood',
    type: 'checkbox',
    filterValues: {
        value,
        onChange,
        items: Object.values(impact).map(([ key, label ]) => ({
            label: label,
            textual: label,
            value: key
        }
        ))
    }
});
