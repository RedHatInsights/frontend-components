import { categoryLabels, categoryValues } from '../RuleTable/constants';
export default ({ onChange, value, ...props } = { onChange: () => undefined }) => ({
    ...props,
    label: 'Category',
    value: 'category',
    type: 'checkbox',
    filterValues: {
        value,
        onChange,
        items: [ ...new Array(categoryValues.length) ].map((_item, key) => ({
            label: categoryLabels[key],
            textual: categoryLabels[key],
            value: categoryValues[key]
        }
        ))
    }
});
