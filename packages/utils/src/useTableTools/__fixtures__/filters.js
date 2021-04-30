export const exampleFilters = [{
    type: 'text',
    label: 'Name',
    filterString: (value) => (`name ~ ${value}`)
}, {
    type: 'checkbox',
    label: 'Compliant',
    filterString: (value) => (`compliant = ${value}`),
    items: [
        { label: 'Compliant', value: 'true' },
        { label: 'Non-compliant', value: 'false' }
    ]
}, {
    type: 'checkbox',
    label: 'Systems meeting compliance',
    filterString: (value) => {
        const scoreRange = value.split('-');
        return `compliance_score >= ${scoreRange[0]} and compliance_score <= ${scoreRange[1]}`;
    },
    items: [
        { label: '90 - 100%', value: '90-100' },
        { label: '70 - 89%', value: '70-89' },
        { label: '50 - 69%', value: '50-69' },
        { label: 'Less than 50%', value: '0-49' }
    ]
}];

export default [
    {
        type: 'text',
        label: 'Name',
        filter: (items, value) => (items.filter((item) => (
            item?.name.includes(value)
        )))
    },
    {
        type: 'checkbox',
        label: 'Chackbox Filter',
        items: [ 'OPTION 1', 'OPTION 2', 'OPTION 3' ].map((option) => ({
            label: option,
            value: option
        })),
        filter: (items) => (items)
    }
];
