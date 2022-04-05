import { defineMessages, MessageDescriptor } from 'react-intl';

// TODO: supply messages with `description`
// default messages
const messages: Record<string, MessageDescriptor> = defineMessages({
  viewAffectedClusters: {
    id: 'viewAffectedClusters',
    defaultMessage: 'View {clusters, plural, one {the affected cluster} other {# affected clusters}}',
  },
  viewAffectedSystems: {
    id: 'viewAffectedSystems',
    defaultMessage: 'View {systems, plural, one {the affected system} other {# affected systems}}',
  },
  impactLevel: {
    id: 'impactLevel',
    defaultMessage: '{level} impact',
  },
  veryLow: {
    id: 'veryLow',
    defaultMessage: 'Very Low',
  },
  low: {
    id: 'low',
    defaultMessage: 'Low',
  },
  medium: {
    id: 'medium',
    defaultMessage: 'Medium',
  },
  moderate: {
    id: 'moderate',
    defaultMessage: 'Moderate',
  },
  important: {
    id: 'important',
    defaultMessage: 'Important',
  },
  high: {
    id: 'high',
    defaultMessage: 'High',
  },
  critical: {
    id: 'critical',
    defaultMessage: 'Critical',
  },
  impactDescription: {
    id: 'impactDescription',
    defaultMessage: 'The impact of the problem would be {level} if it occurred.',
  },
  knowledgebaseArticle: {
    id: 'knowledgebaseArticle',
    defaultMessage: 'Knowledgebase article',
  },
  topicRelatedToRule: {
    id: 'topicRelatedToRule',
    defaultMessage: 'Topics related to this recommendation',
  },
  totalRisk: {
    id: 'totalRisk',
    defaultMessage: 'Total risk',
  },
  rulesDetailsTotalRiskBody: {
    id: 'rulesDetailsTotalRiskBody',
    defaultMessage:
      'The total risk of this remediation is <strong>{risk}</strong>,\n                        based on the combination of likelihood and impact to remediate.',
  },
  undefined: {
    id: 'undefined',
    defaultMessage: 'Undefined',
  },
  likelihoodLevel: {
    id: 'likelihoodLevel',
    defaultMessage: '{level} likelihood',
  },
  likelihoodDescription: {
    id: 'likelihoodDescription',
    defaultMessage: 'The likelihood that this will be a problem is {level}.',
  },
  riskOfChange: {
    id: 'riskOfChange',
    defaultMessage: 'Risk of change',
  },
  systemReboot: {
    id: 'systemReboot',
    defaultMessage: 'System reboot <strong>{ status }</strong> required.',
  },
  is: {
    id: 'is',
    defaultMessage: 'is',
  },
  isNot: {
    id: 'isNot',
    defaultMessage: 'is not',
  },
  feedbackThankYou: {
    id: 'feedbackThankYou',
    defaultMessage: 'Thank you for your feedback!',
  },
  ruleHelpful: {
    id: 'ruleHelpful',
    defaultMessage: 'Is this recommendation helpful?',
  },
});

export default messages;
