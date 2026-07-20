import { ansibleSupport } from '../RuleTable/constants';
export default ({ onChange, value, ...props } = { onChange: () => undefined }) => ({
  ...props,
  label: 'Ansible support',
  value: 'ansible_support',
  type: 'checkbox',
  filterValues: {
    value,
    onChange,
    items: Object.entries(ansibleSupport).map(([key, label]) => ({
      label: label,
      textual: label,
      value: key,
    })),
  },
});
