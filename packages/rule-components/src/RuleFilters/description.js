export default ({ onChange, value, ...props } = { onChange: () => undefined }) => ({
    ...props,
    label: 'Description',
    value: 'description',
    filterValues: {
        value,
        onChange
    }
});
