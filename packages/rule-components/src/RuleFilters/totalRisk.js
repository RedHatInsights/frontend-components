import React from 'react';
import { Battery } from '@redhat-cloud-services/frontend-components/components/Battery';
import { severityLabels, severityValues } from '../RuleTable/constants';

export default ({ onChange, value, ...props } = { onChange: () => undefined }) => ({
    ...props,
    label: 'Total risk',
    value: 'total_risk',
    type: 'checkbox',
    filterValues: {
        value,
        onChange,
        items: [ ...new Array(severityValues.length) ].map((_item, key) => ({
            label: <Battery key={key} label={severityLabels[key]} severity={key + 1} />,
            textual: severityLabels[key],
            value: severityValues[key]
        }
        ))
    }
});
