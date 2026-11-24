import { InsightsLabel } from '@redhat-cloud-services/frontend-components/InsightsLabel';
import messages from '../messages';

export const totalRiskMeta = [
  {
    label: 'Low',
    description: messages.riskTotalRiskDescription0.defaultMessage,
    IconComponent: InsightsLabel,
  },
  {
    label: 'Moderate',
    description: messages.riskTotalRiskDescription1.defaultMessage,
    IconComponent: InsightsLabel,
  },
  {
    label: 'Important',
    description: messages.riskTotalRiskDescription2.defaultMessage,
    IconComponent: InsightsLabel,
  },
  {
    label: 'Critical',
    description: messages.riskTotalRiskDescription3.defaultMessage,
    IconComponent: InsightsLabel,
  },
];

export default totalRiskMeta;
