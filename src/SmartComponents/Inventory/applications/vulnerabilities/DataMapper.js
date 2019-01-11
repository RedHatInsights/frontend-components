import React from 'react';
import { SecurityIcon } from '@patternfly/react-icons';

const colorToImpact = {
    High: 'var(--pf-global--danger-color--100)',
    Important: 'var(--pf-global--danger-color--100)',
    Medium: 'var(--pf-global--warning-color--100)',
    Moderate: 'var(--pf-global--warning-color--100)',
    Critical: 'var(--pf-global--danger-color--100)',
    Low: 'var(--pf-global--BackgroundColor--disabled)'
};

export function createCveListBySystem({ isLoading, ...rest }) {
    if (!isLoading) {
        const { payload: { data, meta }} = rest;
        return {
            data: data.map(row => ({
                id: row.id,
                cells: [
                    <span key={ row.id }>
                        <SecurityIcon size="md" color={ colorToImpact[row.attributes.impact] } />
                    </span>,
                    row.attributes.synopsis,
                    <span key={ `title-${row.id}` } title={ row.attributes.description }>{ row.attributes.description.substr(0, 199) }...</span>,
                    row.attributes.cvss_score || 'N/A',
                    new Date(row.attributes.public_date).toLocaleString()
                ]
            })),
            meta,
            isLoading
        };
    }

    return { data: [], meta: (rest.payload && rest.payload.meta) || {}, isLoading };
}
