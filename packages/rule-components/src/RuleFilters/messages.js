import messages from '../messages';
export const severityFormatters = {
  low: (intl) => intl.formatMessage(messages.filtersSeverityLow),
  moderate: (intl) => intl.formatMessage(messages.filtersSeverityModerate),
  important: (intl) => intl.formatMessage(messages.filtersSeverityImportant),
  critical: (intl) => intl.formatMessage(messages.filtersSeverityCritical),
};
export const riskOfChangeFormatters = {
  very_low: (intl) => intl.formatMessage(messages.filtersRiskOfChangeVeryLow),
  low: (intl) => intl.formatMessage(messages.filtersRiskOfChangeLow),
  moderate: (intl) => intl.formatMessage(messages.filtersRiskOfChangeModerate),
  high: (intl) => intl.formatMessage(messages.filtersRiskOfChangeHigh),
};
export const impactFormatters = {
  critical: (intl) => intl.formatMessage(messages.filtersImpactCritical),
  important: (intl) => intl.formatMessage(messages.filtersImpactImportant),
  moderate: (intl) => intl.formatMessage(messages.filtersImpactModerate),
  low: (intl) => intl.formatMessage(messages.filtersImpactLow),
};
export const categoryFormatters = {
  availability: (intl) => intl.formatMessage(messages.filtersCategoryAvailability),
  performance: (intl) => intl.formatMessage(messages.filtersCategoryPerformance),
  stability: (intl) => intl.formatMessage(messages.filtersCategoryStability),
  security: (intl) => intl.formatMessage(messages.filtersCategorySecurity),
};
export const incidentRulesFormatters = {
  incident: (intl) => intl.formatMessage(messages.filtersIncidentRulesIncident),
  non_incident: (intl) => intl.formatMessage(messages.filtersIncidentRulesNonIncident),
};
export const ansibleSupportFormatters = {
  supported: (intl) => intl.formatMessage(messages.filtersAnsibleSupportSupported),
  not_supported: (intl) => intl.formatMessage(messages.filtersAnsibleSupportNotSupported),
};
export const ruleStatusFormatters = {
  all: (intl) => intl.formatMessage(messages.filtersRuleStatusAll),
  enabled: (intl) => intl.formatMessage(messages.filtersRuleStatusEnabled),
  disabled: (intl) => intl.formatMessage(messages.filtersRuleStatusDisabled),
};
