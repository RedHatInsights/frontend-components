import { defineMessages } from '@redhat-cloud-services/frontend-components-translations/localization';

export default defineMessages({
  reportDetailsAdditionalInfo: {
    description: 'Advisor report section heading for supplementary recommendation information.',
    id: 'advisorComponents.reportDetails.additionalInfo',
    defaultMessage: 'Additional info',
  },
  reportDetailsConflictingPolicy: {
    description:
      'Compliance-conflict detail in an Advisor report. {policy} is the supplied policy name rendered as text; preserve the placeholder and do not translate the name itself.',
    id: 'advisorComponents.reportDetails.conflictingPolicy',
    defaultMessage: 'Conflicting policy: {policy}',
  },
  reportDetailsDetectedIssues: {
    description: 'Advisor report section heading introducing the problems detected by a recommendation.',
    id: 'advisorComponents.reportDetails.detectedIssues',
    defaultMessage: 'Detected issues',
  },
  reportDetailsHideSteps: {
    description: 'Toggle action that hides remediation steps for an Advisor recommendation with a compliance conflict.',
    id: 'advisorComponents.reportDetails.hideSteps',
    defaultMessage: 'Hide remediation steps',
  },
  reportDetailsKnowledgebaseArticle: {
    description: 'Fallback link label for a related Red Hat Knowledgebase article when no published article title is available.',
    id: 'advisorComponents.reportDetails.knowledgebaseArticle',
    defaultMessage: 'Knowledgebase article',
  },
  reportDetailsRelatedKnowledgebaseArticle: {
    description: 'Advisor report section heading introducing a related Red Hat Knowledgebase article.',
    id: 'advisorComponents.reportDetails.relatedKnowledgebaseArticle',
    defaultMessage: 'Related Knowledgebase article',
  },
  reportDetailsShowSteps: {
    description:
      'Acknowledgement action that reveals remediation steps despite a warning that the recommendation conflicts with a compliance policy.',
    id: 'advisorComponents.reportDetails.showSteps',
    defaultMessage: 'I understand the risks, show remediation steps',
  },
  reportDetailsSorryThereWasAnErrorRenderingTheContentCorrectly: {
    description: 'Inline error alert shown when Advisor report content cannot be rendered correctly.',
    id: 'advisorComponents.reportDetails.sorryThereWasAnErrorRenderingTheContentCorrectly',
    defaultMessage: 'Sorry, there was an error rendering the content correctly.',
  },
  reportDetailsStepsToResolve: {
    description: 'Advisor report section heading introducing instructions for resolving the recommendation.',
    id: 'advisorComponents.reportDetails.stepsToResolve',
    defaultMessage: 'Steps to resolve',
  },
  reportDetailsTheResolutionOfThisAdvisorRecommendationConflictsWithARuleDefinedIn: {
    description: 'Warning body explaining that applying an Advisor remediation may violate a rule in the Compliance service.',
    id: 'advisorComponents.reportDetails.theResolutionOfThisAdvisorRecommendationConflictsWithARuleDefinedIn',
    defaultMessage:
      'The resolution of this Advisor recommendation conflicts with a rule defined in the Compliance service. Applying this remediation may impact your compliance status.',
  },
  reportDetailsToMaintainComplianceIgnoreOrDisableThisRecommendation: {
    description: 'Warning heading advising the user to ignore or disable an Advisor recommendation that conflicts with compliance requirements.',
    id: 'advisorComponents.reportDetails.toMaintainComplianceIgnoreOrDisableThisRecommendation',
    defaultMessage: 'To maintain compliance, ignore or disable this recommendation',
  },
  ruleRatingThumbsDown: {
    description: 'Accessible name for the thumbs-down button that gives negative feedback on an Advisor recommendation.',
    id: 'advisorComponents.ruleRating.thumbsDown',
    defaultMessage: 'thumbs-down',
  },
  ruleRatingThumbsUp: {
    description: 'Accessible name for the thumbs-up button that gives positive feedback on an Advisor recommendation.',
    id: 'advisorComponents.ruleRating.thumbsUp',
    defaultMessage: 'thumbs-up',
  },
});
