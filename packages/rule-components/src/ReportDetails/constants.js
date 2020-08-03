import { InsightsLabel } from '@redhat-cloud-services/frontend-components/components/InsightsLabel';
import RiskOfChangeIcon from './RiskOfChangeIcon';

export const totalRiskMeta = [
    {
        label: 'Low',
        description: 'Low severity desc for total risk',
        IconComponent: InsightsLabel
    },
    {
        label: 'Moderate',
        description: 'Moderate severity desc for total risk',
        IconComponent: InsightsLabel
    },
    {
        label: 'Important',
        description: 'Important severity desc for total risk',
        IconComponent: InsightsLabel
    },
    {
        label: 'Critical',
        description: 'Critical severity desc for total risk',
        IconComponent: InsightsLabel
    }
];

export const riskOfChangeMeta = [
    {
        label: 'Very Low',
        description: 'Very Low severity desc for risk of change',
        IconComponent: RiskOfChangeIcon
    },
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
        label: 'High',
        description: 'High severity desc for risk of change',
        IconComponent: RiskOfChangeIcon
    }
];
