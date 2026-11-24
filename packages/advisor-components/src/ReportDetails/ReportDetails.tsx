import { FormattedMessage, useIntlWithFallback } from '@redhat-cloud-services/frontend-components-translations/localization';
import './ReportDetails.scss';

import React, { useState } from 'react';

import { Alert } from '@patternfly/react-core/dist/dynamic/components/Alert';
import { Card } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardBody } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardHeader } from '@patternfly/react-core/dist/dynamic/components/Card';
import { Divider } from '@patternfly/react-core/dist/dynamic/components/Divider';
import { ExpandableSection } from '@patternfly/react-core/dist/dynamic/components/ExpandableSection';
import { Stack } from '@patternfly/react-core/dist/dynamic/layouts/Stack';
import { StackItem } from '@patternfly/react-core/dist/dynamic/layouts/Stack';
import BullseyeIcon from '@patternfly/react-icons/dist/dynamic/icons/bullseye-icon';
import InfoCircleIcon from '@patternfly/react-icons/dist/dynamic/icons/info-circle-icon';
import LightbulbIcon from '@patternfly/react-icons/dist/dynamic/icons/lightbulb-icon';
import ThumbsUpIcon from '@patternfly/react-icons/dist/dynamic/icons/thumbs-up-icon';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components/Skeleton';

import { RuleContentOcp, RuleContentRhel } from '../types';
import { TemplateProcessor } from '../TemplateProcessor';
import { ExternalLink } from '../common';
import messages from '../messages';

interface Report {
  rule: RuleContentRhel | RuleContentOcp;
  details: Record<string, unknown>;
  resolution: string;
}

interface ReportDetailsProps {
  report: Report;
  kbaDetail: {
    publishedTitle: string;
    id: string;
    view_uri: string;
  };
  kbaLoading: boolean; // if true, renders skeleton instead of kba link
  isProd: boolean;
}

const ReportDetails = ({
  report,
  kbaDetail = {
    publishedTitle: 'N/A',
    id: '',
    view_uri: '',
  },
  kbaLoading,
  isProd,
}: ReportDetailsProps) => {
  const intl = useIntlWithFallback();

  const { rule, details, resolution } = report;
  // remove conflict_compliance_policies_enabled from details to avoid rendering it in templates
  const { conflict_compliance_policies_enabled, ...filteredDetails } = details;
  const [error, setError] = useState<Error | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const onToggle = (_event: any, isExpanded: boolean) => {
    setIsExpanded(isExpanded);
  };

  const handleError = (e: Error) => {
    if (error === null) {
      setError(e);
    }
  };

  const linkEditor = (url: string) => {
    const linkToArray = url?.split('/');
    if (isProd) {
      return `https://access.redhat.com/${linkToArray?.at(-2)}/${linkToArray?.at(-1)}`;
    } else {
      return `https://access.stage.redhat.com/${linkToArray?.at(-2)}/${linkToArray?.at(-1)}`;
    }
  };

  return (
    <Card className="ins-c-report-details" style={{ boxShadow: 'none' }}>
      <CardBody>
        {error && (
          <React.Fragment>
            <Alert variant="danger" title={intl.formatMessage(messages.reportDetailsSorryThereWasAnErrorRenderingTheContentCorrectly)} isInline />
            <br />
          </React.Fragment>
        )}
        <Stack className="ins-c-report-details__cards-stack" widget-type="InsightsRulesCard" hasGutter>
          <StackItem>
            <Card isCompact isPlain>
              <CardHeader>
                <BullseyeIcon className="ins-c-report-details__icon" />
                <strong>
                  <FormattedMessage {...messages.reportDetailsDetectedIssues} />
                </strong>
              </CardHeader>
              <CardBody>{rule.reason && <TemplateProcessor template={rule.reason} definitions={filteredDetails} onError={handleError} />}</CardBody>
            </Card>
          </StackItem>
          <Divider />
          <StackItem>
            <Card isCompact isPlain>
              <CardHeader>
                <ThumbsUpIcon className="ins-c-report-details__icon" />
                <strong>
                  <FormattedMessage {...messages.reportDetailsStepsToResolve} />
                </strong>
              </CardHeader>
              <CardBody>
                {conflict_compliance_policies_enabled ? (
                  <>
                    <Alert
                      isInline
                      variant="warning"
                      title={intl.formatMessage(messages.reportDetailsToMaintainComplianceIgnoreOrDisableThisRecommendation)}
                    >
                      <p>
                        <FormattedMessage {...messages.reportDetailsTheResolutionOfThisAdvisorRecommendationConflictsWithARuleDefinedIn} />
                      </p>
                      {typeof conflict_compliance_policies_enabled === 'object' && (
                        <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                          {Object.keys(conflict_compliance_policies_enabled as Record<string, unknown>).map((policy) => (
                            <li key={policy}>
                              <FormattedMessage
                                {...messages.reportDetailsConflictingPolicy}

                                values={{ policy }}
                              />
                            </li>
                          ))}
                        </ul>
                      )}
                    </Alert>
                    <ExpandableSection
                      isExpanded={isExpanded}
                      onToggle={onToggle}
                      toggleText={
                        isExpanded ? intl.formatMessage(messages.reportDetailsHideSteps) : intl.formatMessage(messages.reportDetailsShowSteps)
                      }
                      isIndented
                    >
                      {resolution && <TemplateProcessor template={resolution} definitions={filteredDetails} onError={handleError} />}
                    </ExpandableSection>
                  </>
                ) : (
                  resolution && <TemplateProcessor template={resolution} definitions={filteredDetails} onError={handleError} />
                )}
              </CardBody>
            </Card>
          </StackItem>
          {kbaDetail.publishedTitle !== 'N/A' && (
            <React.Fragment>
              <Divider />
              <StackItem>
                <Card className="ins-c-report-details__kba" isCompact isPlain>
                  <CardHeader>
                    <LightbulbIcon className="ins-c-report-details__icon" />
                    <strong>
                      <FormattedMessage {...messages.reportDetailsRelatedKnowledgebaseArticle} />
                    </strong>
                  </CardHeader>
                  <CardBody>
                    {kbaLoading ? (
                      <Skeleton size={SkeletonSize.sm} />
                    ) : (
                      <React.Fragment>
                        <ExternalLink
                          href={`${linkEditor(kbaDetail?.view_uri)}`}
                          content={
                            kbaDetail?.publishedTitle ? kbaDetail?.publishedTitle : intl.formatMessage(messages.reportDetailsKnowledgebaseArticle)
                          }
                        />
                        .
                      </React.Fragment>
                    )}
                  </CardBody>
                </Card>
              </StackItem>
            </React.Fragment>
          )}
          {rule.more_info && (
            <React.Fragment>
              <Divider />
              <StackItem>
                <Card isCompact isPlain>
                  <CardHeader>
                    <InfoCircleIcon className="ins-c-report-details__icon" />
                    <strong>
                      <FormattedMessage {...messages.reportDetailsAdditionalInfo} />
                    </strong>
                  </CardHeader>
                  <CardBody>{<TemplateProcessor template={rule.more_info} definitions={filteredDetails} onError={handleError} />}</CardBody>
                </Card>
              </StackItem>
            </React.Fragment>
          )}
        </Stack>
      </CardBody>
    </Card>
  );
};

export default ReportDetails;
