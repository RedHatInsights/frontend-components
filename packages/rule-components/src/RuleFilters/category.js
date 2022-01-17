import { category } from '../RuleTable/constants';
export default ({ onChange, value, ...props } = { onChange: () => undefined }) => ({
  ...props,
  label: 'Category',
  value: 'category',
  type: 'checkbox',
  filterValues: {
    value,
    onChange,
    items: Object.entries(category).map(([key, label]) => ({
      label: label,
      textual: label,
      value: key,
    })),
  },
});
