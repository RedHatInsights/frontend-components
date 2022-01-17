export default ({ onChange, value, ...props } = { onChange: () => undefined }) => ({
  ...props,
  label: 'Description',
  value: 'description',
  filterValues: {
    'aria-label': 'Description Filter Input',
    value,
    onChange,
  },
});
