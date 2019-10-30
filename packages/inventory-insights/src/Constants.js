/* eslint-disable camelcase */
export const BASE_FETCH_URL = '/api/insights/v1/';

export const FILTER_CATEGORIES = {
    has_playbook: {
        type: 'radio', title: 'Ansible support', urlParam: 'has_playbook', values: [
            { label: 'Ansible remediation support', value: 'true' },
            { label: 'No Ansible remediation support', value: 'false' },
            { label: 'All rules', value: 'all' }
        ]
    },
    total_risk: {
        type: 'checkbox', title: 'Total risk', urlParam: 'total_risk', values: [
            { label: 'Critical', value: '4' },
            { label: 'Important', value: '3' },
            { label: 'Moderate', value: '2' },
            { label: 'Low', value: '1' }
        ]
    }
};
