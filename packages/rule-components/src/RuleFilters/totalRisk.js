import React from 'react';
import { Battery } from '@redhat-cloud-services/frontend-components/components/Battery';
import { severity } from '../RuleTable/constants';

export default ({ onChange, value, ...props } = { onChange: () => undefined }) => ({
    ...props,
    label: 'Total risk',
    value: 'total_risk',
    type: 'checkbox',
    filterValues: {
        value,
        onChange,
        items: Object.entries(severity).map(([ key, label ], index) => ({
            label: label,
            textual: label,
            value: key
        }))
    }
});
