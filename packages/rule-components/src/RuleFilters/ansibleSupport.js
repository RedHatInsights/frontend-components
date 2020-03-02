import { ansibleSupportLabels, ansibleSupportValues } from '../RuleTable/constants';
export default ({ onChange, value, ...props } = { onChange: () => undefined }) => ({
    ...props,
    label: 'Ansible support',
    value: 'ansible_support',
    type: 'checkbox',
    filterValues: {
        value,
        onChange,
        items: [ ...new Array(ansibleSupportValues.length) ].map((_item, key) => ({
            label: ansibleSupportLabels[key],
            textual: ansibleSupportLabels[key],
            value: ansibleSupportValues[key]
        }
        ))
    }
});
