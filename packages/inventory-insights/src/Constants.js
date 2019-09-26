export const BASE_FETCH_URL = '/api/insights/v1/';

export const FILTER_CATEGORIES = [
    {
        type: 'checkbox', title: 'Ansible support', urlParam: 'has_playbook', values: [
            { label: 'Has support', value: true },
            { label: 'No support', value: false }
        ]
    }, {
        type: 'checkbox', title: 'Total risk', urlParam: 'total_risk', values: [
            { label: 'Critical', value: '4' },
            { label: 'Important', value: '3' },
            { label: 'Moderate', value: '2' },
            { label: 'Low', value: '1' }
        ]
    }, {
        type: 'checkbox', title: 'Risk of change', urlParam: 'risk', values: [
            { label: 'Critical', value: '4' },
            { label: 'Important', value: '3' },
            { label: 'Moderate', value: '2' },
            { label: 'Low', value: '1' }
        ]
    }
];
