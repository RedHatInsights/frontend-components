import { incidentRules } from '../RuleTable/constants';
export default ({ onChange, value, ...props } = { onChange: () => undefined }) => ({
  ...props,
  label: 'Incident rules',
  value: 'incident_rules',
  type: 'checkbox',
  filterValues: {
    value,
    onChange,
    items: Object.entries(incidentRules).map(([key, label]) => ({
      label: label,
      textual: label,
      value: key,
    })),
  },
});
