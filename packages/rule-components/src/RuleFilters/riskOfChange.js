import React from 'react';
import { Shield } from '@redhat-cloud-services/frontend-components/components/Shield';
import { riskOfChangeLabels, riskOfChangeValues } from '../RuleTable/constants';

export default ({ onChange, value, ...props } = { onChange: () => undefined }) => ({
    ...props,
    label: 'Risk of change',
    value: 'risk_of_change',
    type: 'checkbox',
    filterValues: {
        value,
        onChange,
        items: riskOfChangeValues.map((_item, key) => ({
            label: <span>
                <Shield impact={key + 1} hasTooltip={false} size="sm" />
                {riskOfChangeLabels[key]}
            </span>,
            textual: riskOfChangeLabels[key],
            value: riskOfChangeValues[key]
        }
        )).reverse()
    }
});
