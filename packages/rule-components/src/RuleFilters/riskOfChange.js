import React from 'react';
import { Shield } from '@redhat-cloud-services/frontend-components/Shield';
import { riskOfChange } from '../RuleTable/constants';

export default ({ onChange, value, ...props } = { onChange: () => undefined }) => ({
  ...props,
  label: 'Risk of change',
  value: 'risk_of_change',
  type: 'checkbox',
  filterValues: {
    value,
    onChange,
    items: Object.entries(riskOfChange)
      .map(([key, label], index) => ({
        label: (
          <span>
            <Shield impact={index + 1} hasTooltip={false} size="sm" />
            {label}
          </span>
        ),
        textual: label,
        value: key,
      }))
      .reverse(),
  },
});
