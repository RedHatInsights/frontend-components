import React from 'react';
import { Battery } from '@redhat-cloud-services/frontend-components/components/Battery';

export const totalRiskMeta = [
    {
        label: 'low',
        description: 'low severity desc for total risk',
        IconComponent: Battery
    },
    {
        label: 'moderate',
        description: 'moderate severity desc for total risk',
        IconComponent: Battery
    },
    {
        label: 'important',
        description: 'important severity desc for total risk',
        IconComponent: Battery
    },
    {
        label: 'critical',
        description: 'critical severity desc for total risk',
        IconComponent: Battery
    }
];

export const riskOfChangeMeta = [
    {
        label: 'low',
        description: 'low severity desc for risk of change',
        IconComponent: Battery
    },
    {
        label: 'moderate',
        description: 'moderate severity desc for risk of change',
        IconComponent: Battery
    },
    {
        label: 'important',
        description: 'important severity desc for risk of change',
        IconComponent: Battery
    },
    {
        label: 'critical',
        description: 'critical severity desc for risk of change',
        IconComponent: Battery
    }
];
