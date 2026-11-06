import { defineMessages } from '@redhat-cloud-services/frontend-components-translations/localization';

export default defineMessages({
  reportDetailsAdditionalInfo: { id: 'advisorComponents.reportDetails.additionalInfo', defaultMessage: 'Additional info' },
  reportDetailsConflictingPolicy: { id: 'advisorComponents.reportDetails.conflictingPolicy', defaultMessage: 'Conflicting policy: {policy}' },
  reportDetailsDetectedIssues: { id: 'advisorComponents.reportDetails.detectedIssues', defaultMessage: 'Detected issues' },
  reportDetailsHideSteps: { id: 'advisorComponents.reportDetails.hideSteps', defaultMessage: 'Hide remediation steps' },
  reportDetailsKnowledgebaseArticle: { id: 'advisorComponents.reportDetails.knowledgebaseArticle', defaultMessage: 'Knowledgebase article' },
  reportDetailsRelatedKnowledgebaseArticle: {
    id: 'advisorComponents.reportDetails.relatedKnowledgebaseArticle',
    defaultMessage: 'Related Knowledgebase article',
  },
  reportDetailsShowSteps: { id: 'advisorComponents.reportDetails.showSteps', defaultMessage: 'I understand the risks, show remediation steps' },
  reportDetailsSorryThereWasAnErrorRenderingTheContentCorrectly: {
    id: 'advisorComponents.reportDetails.sorryThereWasAnErrorRenderingTheContentCorrectly',
    defaultMessage: 'Sorry, there was an error rendering the content correctly.',
  },
  reportDetailsStepsToResolve: { id: 'advisorComponents.reportDetails.stepsToResolve', defaultMessage: 'Steps to resolve' },
  reportDetailsTheResolutionOfThisAdvisorRecommendationConflictsWithARuleDefinedIn: {
    id: 'advisorComponents.reportDetails.theResolutionOfThisAdvisorRecommendationConflictsWithARuleDefinedIn',
    defaultMessage:
      'The resolution of this Advisor recommendation conflicts with a rule defined in the Compliance service. Applying this remediation may impact your compliance status.',
  },
  reportDetailsToMaintainComplianceIgnoreOrDisableThisRecommendation: {
    id: 'advisorComponents.reportDetails.toMaintainComplianceIgnoreOrDisableThisRecommendation',
    defaultMessage: 'To maintain compliance, ignore or disable this recommendation',
  },
  ruleRatingThumbsDown: { id: 'advisorComponents.ruleRating.thumbsDown', defaultMessage: 'thumbs-down' },
  ruleRatingThumbsUp: { id: 'advisorComponents.ruleRating.thumbsUp', defaultMessage: 'thumbs-up' },
});
