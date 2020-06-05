/* eslint-disable camelcase */
import { Battery } from '@redhat-cloud-services/frontend-components/components/esm/Battery';
import React from 'react';

export const BASE_FETCH_URL = '/api/insights/v1/';

export const FILTER_CATEGORIES = {
    total_risk: {
        type: 'checkbox', title: 'total risk', urlParam: 'total_risk', values: [
            { label: <Battery label='Critical' severity={4} />, text: 'Critical', value: '4' },
            { label: <Battery label='Important' severity={3} />, text: 'Important', value: '3' },
            { label: <Battery label='Moderate' severity={2} />, text: 'Moderate', value: '2' },
            { label: <Battery label='Low' severity={1} />, text: 'Low', value: '1' }
        ]
    },
    category: {
        type: 'checkbox', title: 'category', urlParam: 'category', values: [
            { label: 'Availability', text: 'Availability', value: 'Availability' },
            { label: 'Performance', text: 'Performance', value: 'Performance' },
            { label: 'Stability', text: 'Stability', value: 'Stability' },
            { label: 'Security', text: 'Security', value: 'Security' }
        ]
    },
    has_playbook: {
        type: 'checkbox', title: 'Ansible support', urlParam: 'has_playbook', values: [
            { label: 'Ansible remediation support', text: 'Ansible remediation support', value: 'true' },
            { label: 'No Ansible remediation support', text: 'No Ansible remediation support', value: 'false' }
        ]
    }
};

export const RISK_TO_STRING = {
    1: 'Low',
    2: 'Moderate',
    3: 'Important',
    4: 'Critical'
};

export const IMPACT_LABEL = {
    1: 'Low',
    2: 'Moderate',
    3: 'Important',
    4: 'Critical'
};
export const LIKELIHOOD_LABEL = {
    1: 'Low',
    2: 'Moderate',
    3: 'Important',
    4: 'Critical'
};
