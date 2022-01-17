import { impact } from '../RuleTable/constants';
export default ({ onChange, value, ...props } = { onChange: () => undefined }) => ({
  ...props,
  label: 'Impact',
  value: 'impact',
  type: 'checkbox',
  filterValues: {
    value,
    onChange,
    items: Object.entries(impact).map(([key, label]) => ({
      label: label,
      textual: label,
      value: key,
    })),
  },
});
