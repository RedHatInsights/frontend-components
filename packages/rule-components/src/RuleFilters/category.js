import { categoryLabels, categoryValues } from '../RuleTable/constants';
export default ({ onChange, value, ...props } = { onChange: () => undefined }) => ({
    ...props,
    label: 'Category',
    value: 'category',
    type: 'checkbox',
    filterValues: {
        value,
        onChange,
        items: categoryValues.map((_item, key) => ({
            label: categoryLabels[key],
            textual: categoryLabels[key],
            value: categoryValues[key]
        }
        ))
    }
});
