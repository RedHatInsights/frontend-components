import { severity } from '../RuleTable/constants';

export default ({ onChange, value, ...props } = { onChange: () => undefined }) => ({
  ...props,
  label: 'Total risk',
  value: 'total_risk',
  type: 'checkbox',
  filterValues: {
    value,
    onChange,
    items: Object.entries(severity).map(([key, label]) => ({
      label: label,
      textual: label,
      value: key,
    })),
  },
});
