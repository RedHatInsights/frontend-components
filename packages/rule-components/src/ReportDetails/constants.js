import React from 'react';
import { Battery } from '@redhat-cloud-services/frontend-components/components/Battery';
import RiskOfChangeIcon from './RiskOfChangeIcon';

export const totalRiskMeta = [
    {
        label: 'Low',
        description: 'Low severity desc for total risk',
        IconComponent: Battery
    },
    {
        label: 'Moderate',
        description: 'Moderate severity desc for total risk',
        IconComponent: Battery
    },
    {
        label: 'Important',
        description: 'Important severity desc for total risk',
        IconComponent: Battery
    },
    {
        label: 'Critical',
        description: 'Critical severity desc for total risk',
        IconComponent: Battery
    }
];

export const riskOfChangeMeta = [
    {
        label: 'Low',
        description: 'Low severity desc for risk of change',
        IconComponent: RiskOfChangeIcon
    },
    {
        label: 'Moderate',
        description: 'Moderate severity desc for risk of change',
        IconComponent: RiskOfChangeIcon
    },
    {
        label: 'Important',
        description: 'Important severity desc for risk of change',
        IconComponent: RiskOfChangeIcon
    },
    {
        label: 'Critical',
        description: 'Critical severity desc for risk of change',
        IconComponent: RiskOfChangeIcon
    }
];
