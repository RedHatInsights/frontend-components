import { ruleStatus } from '../RuleTable/constants';
export default ({ onChange, value, ...props } = { onChange: () => undefined }) => ({
  ...props,
  label: 'Rule status',
  value: 'rule_status',
  type: 'radio',
  filterValues: {
    value,
    onChange,
    items: Object.entries(ruleStatus).map(([key, label]) => ({
      label: label,
      textual: label,
      value: key,
    })),
  },
});
