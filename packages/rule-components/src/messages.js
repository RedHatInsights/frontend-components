import { defineMessages } from '@redhat-cloud-services/frontend-components-translations/localization';

export default defineMessages({
  filtersAnsibleSupportLabel: {
    description: 'Filter-category label for whether recommendations support Ansible remediation. Ansible is a product name.',
    id: 'ruleComponents.filters.ansibleSupport.label',
    defaultMessage: 'Ansible support',
  },
  filtersAnsibleSupportNotSupported: {
    description: 'Filter option for recommendations without Ansible remediation support.',
    id: 'ruleComponents.filters.ansibleSupport.not_supported',
    defaultMessage: 'No Ansible remediation support',
  },
  filtersAnsibleSupportSupported: {
    description: 'Filter option for recommendations that support Ansible remediation.',
    id: 'ruleComponents.filters.ansibleSupport.supported',
    defaultMessage: 'Ansible remediation support',
  },
  filtersCategoryAvailability: {
    description: 'Rule category filter option for issues affecting service availability.',
    id: 'ruleComponents.filters.category.availability',
    defaultMessage: 'Availability',
  },
  filtersCategoryLabel: {
    description: 'Filter-category label for grouping rules by the kind of problem they address.',
    id: 'ruleComponents.filters.category.label',
    defaultMessage: 'Category',
  },
  filtersCategoryPerformance: {
    description: 'Rule category filter option for performance issues.',
    id: 'ruleComponents.filters.category.performance',
    defaultMessage: 'Performance',
  },
  filtersCategorySecurity: {
    description: 'Rule category filter option for security issues.',
    id: 'ruleComponents.filters.category.security',
    defaultMessage: 'Security',
  },
  filtersCategoryStability: {
    description: 'Rule category filter option for system or service stability issues.',
    id: 'ruleComponents.filters.category.stability',
    defaultMessage: 'Stability',
  },
  filtersDescriptionInput: {
    description: 'Accessible name for the text input that filters rules by their description.',
    id: 'ruleComponents.filters.description.input',
    defaultMessage: 'Description Filter Input',
  },
  filtersDescriptionLabel: {
    description: 'Filter-category label for searching the description text of rules.',
    id: 'ruleComponents.filters.description.label',
    defaultMessage: 'Description',
  },
  filtersImpactCritical: {
    description: 'Critical impact option in the rule impact filter.',
    id: 'ruleComponents.filters.impact.critical',
    defaultMessage: 'Critical',
  },
  filtersImpactImportant: {
    description: 'Important impact option in the rule impact filter; a named rating between Critical and Moderate.',
    id: 'ruleComponents.filters.impact.important',
    defaultMessage: 'Important',
  },
  filtersImpactLabel: {
    description: 'Filter-category label for the potential impact of a rule issue.',
    id: 'ruleComponents.filters.impact.label',
    defaultMessage: 'Impact',
  },
  filtersImpactLow: { description: 'Low impact option in the rule impact filter.', id: 'ruleComponents.filters.impact.low', defaultMessage: 'Low' },
  filtersImpactModerate: {
    description: 'Moderate impact option in the rule impact filter.',
    id: 'ruleComponents.filters.impact.moderate',
    defaultMessage: 'Moderate',
  },
  filtersIncidentRulesIncident: {
    description:
      'Incident-rule filter option currently displayed as Non-incident rules despite its incident key. Confirm the label-to-value mapping with the product owner before translation.',
    id: 'ruleComponents.filters.incidentRules.incident',
    defaultMessage: 'Non-incident rules',
  },
  filtersIncidentRulesLabel: {
    description: 'Filter-category label for distinguishing incident-related and non-incident rules.',
    id: 'ruleComponents.filters.incidentRules.label',
    defaultMessage: 'Incident rules',
  },
  filtersIncidentRulesNonIncident: {
    description:
      'Incident-rule filter option currently displayed as Incident rules despite its non_incident key. Confirm the label-to-value mapping with the product owner before translation.',
    id: 'ruleComponents.filters.incidentRules.non_incident',
    defaultMessage: 'Incident rules',
  },
  filtersLikelihoodLabel: {
    description: 'Filter-category label for the likelihood that a rule issue will occur.',
    id: 'ruleComponents.filters.likelihood.label',
    defaultMessage: 'Likelihood',
  },
  filtersRiskOfChangeHigh: {
    description: 'High risk-of-change filter option, referring to the risk of applying a remediation rather than leaving the issue unresolved.',
    id: 'ruleComponents.filters.riskOfChange.high',
    defaultMessage: 'High',
  },
  filtersRiskOfChangeLabel: {
    description: 'Filter-category label for the risk associated with applying a remediation.',
    id: 'ruleComponents.filters.riskOfChange.label',
    defaultMessage: 'Risk of change',
  },
  filtersRiskOfChangeLow: {
    description: 'Low risk-of-change filter option, referring to the risk of applying a remediation.',
    id: 'ruleComponents.filters.riskOfChange.low',
    defaultMessage: 'Low',
  },
  filtersRiskOfChangeModerate: {
    description: 'Moderate risk-of-change filter option, referring to the risk of applying a remediation.',
    id: 'ruleComponents.filters.riskOfChange.moderate',
    defaultMessage: 'Moderate',
  },
  filtersRiskOfChangeVeryLow: {
    description: 'Very low risk-of-change filter option, referring to the risk of applying a remediation.',
    id: 'ruleComponents.filters.riskOfChange.very_low',
    defaultMessage: 'Very low',
  },
  filtersRuleStatusAll: {
    description: 'Rule status filter option that includes both enabled and disabled rules.',
    id: 'ruleComponents.filters.ruleStatus.all',
    defaultMessage: 'All',
  },
  filtersRuleStatusDisabled: {
    description: 'Rule status filter option showing disabled rules.',
    id: 'ruleComponents.filters.ruleStatus.disabled',
    defaultMessage: 'Disabled',
  },
  filtersRuleStatusEnabled: {
    description: 'Rule status filter option showing enabled rules.',
    id: 'ruleComponents.filters.ruleStatus.enabled',
    defaultMessage: 'Enabled',
  },
  filtersRuleStatusLabel: {
    description: 'Filter-category label for whether a rule is enabled or disabled.',
    id: 'ruleComponents.filters.ruleStatus.label',
    defaultMessage: 'Rule status',
  },
  filtersSeverityCritical: {
    description: 'Critical severity option used in rule severity filter choices.',
    id: 'ruleComponents.filters.severity.critical',
    defaultMessage: 'Critical',
  },
  filtersSeverityImportant: {
    description: 'Important severity option used in rule severity filter choices; a named rating distinct from Critical and Moderate.',
    id: 'ruleComponents.filters.severity.important',
    defaultMessage: 'Important',
  },
  filtersSeverityLow: {
    description: 'Low severity option used in rule severity filter choices.',
    id: 'ruleComponents.filters.severity.low',
    defaultMessage: 'Low',
  },
  filtersSeverityModerate: {
    description: 'Moderate severity option used in rule severity filter choices.',
    id: 'ruleComponents.filters.severity.moderate',
    defaultMessage: 'Moderate',
  },
  filtersTotalRiskLabel: {
    description: 'Filter-category label for the overall risk rating of a rule issue.',
    id: 'ruleComponents.filters.totalRisk.label',
    defaultMessage: 'Total risk',
  },
  markdownOuchWeWereUnableToCorrectlyRenderThisTextInsteadPleaseEnjoy: {
    description: 'Markdown rendering failure notice shown before the original unformatted content, which remains available to the user.',
    id: 'ruleComponents.markdown.ouchWeWereUnableToCorrectlyRenderThisTextInsteadPleaseEnjoy',
    defaultMessage: 'Ouch. We were unable to correctly render this text, instead please enjoy the raw data.',
  },
  reportDetailsPublishedDate: {
    description:
      'Rule report publication date label. <date></date> inserts caller-provided date content; preserve the rich-text tag rather than supplying a date format here.',
    id: 'ruleComponents.reportDetails.publishedDate',
    defaultMessage: 'Published date: <date></date>',
  },
  reportDetailsRiskOfChange: {
    description: 'Rule report heading for the risk of applying a remediation.',
    id: 'ruleComponents.reportDetails.riskOfChange',
    defaultMessage: 'Risk of change',
  },
  reportDetailsTotalRisk: {
    description: 'Rule report heading for the overall risk of the reported issue.',
    id: 'ruleComponents.reportDetails.totalRisk',
    defaultMessage: 'Total risk',
  },
  riskRiskOfChangeDescription0: {
    description:
      'Tooltip for the Very Low risk-of-change rating. Source currently uses placeholder-like wording; confirm the final explanation with the product owner.',
    id: 'ruleComponents.risk.riskOfChangeDescription0',
    defaultMessage: 'Very Low severity desc for risk of change',
  },
  riskRiskOfChangeDescription1: {
    description:
      'Tooltip for the Low risk-of-change rating. Source currently uses placeholder-like wording; confirm the final explanation with the product owner.',
    id: 'ruleComponents.risk.riskOfChangeDescription1',
    defaultMessage: 'Low severity desc for risk of change',
  },
  riskRiskOfChangeDescription2: {
    description:
      'Tooltip for the Moderate risk-of-change rating. Source currently uses placeholder-like wording; confirm the final explanation with the product owner.',
    id: 'ruleComponents.risk.riskOfChangeDescription2',
    defaultMessage: 'Moderate severity desc for risk of change',
  },
  riskRiskOfChangeDescription3: {
    description:
      'Tooltip for the High risk-of-change rating. Source currently uses placeholder-like wording; confirm the final explanation with the product owner.',
    id: 'ruleComponents.risk.riskOfChangeDescription3',
    defaultMessage: 'High severity desc for risk of change',
  },
  riskRiskOfChangeLabel0: {
    description: 'Very Low rating label in the rule report risk-of-change indicator, describing the risk of applying a remediation.',
    id: 'ruleComponents.risk.riskOfChangeLabel0',
    defaultMessage: 'Very Low',
  },
  riskRiskOfChangeLabel1: {
    description: 'Low rating label in the rule report risk-of-change indicator.',
    id: 'ruleComponents.risk.riskOfChangeLabel1',
    defaultMessage: 'Low',
  },
  riskRiskOfChangeLabel2: {
    description: 'Moderate rating label in the rule report risk-of-change indicator.',
    id: 'ruleComponents.risk.riskOfChangeLabel2',
    defaultMessage: 'Moderate',
  },
  riskRiskOfChangeLabel3: {
    description: 'High rating label in the rule report risk-of-change indicator.',
    id: 'ruleComponents.risk.riskOfChangeLabel3',
    defaultMessage: 'High',
  },
  riskTotalRiskDescription0: {
    description:
      'Tooltip for the Low total-risk rating of an issue. Source currently uses placeholder-like wording; confirm the final explanation with the product owner.',
    id: 'ruleComponents.risk.totalRiskDescription0',
    defaultMessage: 'Low severity desc for total risk',
  },
  riskTotalRiskDescription1: {
    description:
      'Tooltip for the Moderate total-risk rating of an issue. Source currently uses placeholder-like wording; confirm the final explanation with the product owner.',
    id: 'ruleComponents.risk.totalRiskDescription1',
    defaultMessage: 'Moderate severity desc for total risk',
  },
  riskTotalRiskDescription2: {
    description:
      'Tooltip for the Important total-risk rating of an issue. Source currently uses placeholder-like wording; confirm the final explanation with the product owner.',
    id: 'ruleComponents.risk.totalRiskDescription2',
    defaultMessage: 'Important severity desc for total risk',
  },
  riskTotalRiskDescription3: {
    description:
      'Tooltip for the Critical total-risk rating of an issue. Source currently uses placeholder-like wording; confirm the final explanation with the product owner.',
    id: 'ruleComponents.risk.totalRiskDescription3',
    defaultMessage: 'Critical severity desc for total risk',
  },
  ruleFeedbackHelpful: {
    description: 'Accessible name for the thumbs-up action that marks a rule as helpful.',
    id: 'ruleComponents.ruleFeedback.helpful',
    defaultMessage: 'Rule is helpful',
  },
  ruleFeedbackIsThisHelpful: {
    description: 'Feedback prompt asking whether the displayed rule information is helpful.',
    id: 'ruleComponents.ruleFeedback.isThisHelpful',
    defaultMessage: 'Is this helpful?',
  },
  ruleFeedbackNotHelpful: {
    description: 'Accessible name for the thumbs-down action that marks a rule as not helpful.',
    id: 'ruleComponents.ruleFeedback.notHelpful',
    defaultMessage: 'Rule is not helpful',
  },
  ruleFeedbackThanks: {
    description: 'Confirmation displayed after feedback on the usefulness of a rule is saved.',
    id: 'ruleComponents.ruleFeedback.thanks',
    defaultMessage: 'Thank you for your feedback!',
  },
  ruleTableAriaLabel: {
    description: 'Default accessible name of the table listing rules.',
    id: 'ruleComponents.ruleTable.ariaLabel',
    defaultMessage: 'Rules table',
  },
  ruleTableNoResults: {
    description: 'Default empty-state heading when the rules table has no results to display.',
    id: 'ruleComponents.ruleTable.noResults',
    defaultMessage: 'No results found',
  },
  ruleTableNoResultsDescription: {
    description: 'Default rules-table empty-state guidance suggesting that active filters be removed or cleared to show results.',
    id: 'ruleComponents.ruleTable.noResultsDescription',
    defaultMessage: 'No results match the filter criteria. Remove all filters or clear all filters to show results.',
  },
});
