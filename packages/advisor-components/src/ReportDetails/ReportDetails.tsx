import './ReportDetails.scss';

import React, { useState } from 'react';

import { Alert, Card, CardBody, CardHeader, Divider, Stack, StackItem } from '@patternfly/react-core';
import { BullseyeIcon, InfoCircleIcon, LightbulbIcon, ThumbsUpIcon } from '@patternfly/react-icons';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components/Skeleton';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

import { RuleContentOcp, RuleContentRhel } from '../types';
import { TemplateProcessor } from '../TemplateProcessor';
import { ExternalLink } from '../common';

interface Report {
  rule: RuleContentRhel | RuleContentOcp;
  details: Record<string, string | number>;
  resolution: string;
}

interface ReportDetailsProps {
  report: Report;
  kbaDetail: {
    publishedTitle: string;
    view_uri: string;
  };
  kbaLoading: boolean; // if true, renders skeleton instead of kba link
}

const ReportDetails: React.FC<ReportDetailsProps> = ({ report, kbaDetail, kbaLoading }) => {
  const { rule, details, resolution } = report;
  const [error, setError] = useState<Error | null>(null);
  const { isProd } = useChrome();

  const handleError = (e: Error) => {
    if (error === null) {
      setError(e);
    }
  };

  const linkEditor = (url: string) => {
    const linkToArray = url.split('/');
    if (isProd()) {
      return `https://access.redhat.com/${linkToArray.at(-2)}/${linkToArray.at(-1)}`;
    } else {
      return `https://access.stage.redhat.com/${linkToArray.at(-2)}/${linkToArray.at(-1)}`;
    }
  };

  return (
    <Card className="ins-c-report-details" style={{ boxShadow: 'none' }}>
      <CardBody>
        {error && (
          <React.Fragment>
            <Alert variant="danger" title="Sorry, there was an error rendering the content correctly." isInline />
            <br />
          </React.Fragment>
        )}
        <Stack className="ins-c-report-details__cards-stack" widget-type="InsightsRulesCard" hasGutter>
          <StackItem>
            <Card isCompact isPlain>
              <CardHeader>
                <BullseyeIcon className="ins-c-report-details__icon" />
                <strong>Detected issues</strong>
              </CardHeader>
              <CardBody>{rule.reason && <TemplateProcessor template={rule.reason} definitions={details} onError={handleError} />}</CardBody>
            </Card>
          </StackItem>
          <Divider />
          <StackItem>
            <Card isCompact isPlain>
              <CardHeader>
                <ThumbsUpIcon className="ins-c-report-details__icon" />
                <strong>Steps to resolve</strong>
              </CardHeader>
              <CardBody>{resolution && <TemplateProcessor template={resolution} definitions={details} onError={handleError} />}</CardBody>
            </Card>
          </StackItem>
          {(rule as RuleContentRhel).node_id && (
            <React.Fragment>
              <Divider />
              <StackItem>
                <Card className="ins-c-report-details__kba" isCompact isPlain>
                  <CardHeader>
                    <LightbulbIcon className="ins-c-report-details__icon" />
                    <strong>Related Knowledgebase article</strong>
                  </CardHeader>
                  <CardBody>
                    {kbaLoading ? (
                      <Skeleton size={SkeletonSize.sm} />
                    ) : (
                      <React.Fragment>
                        <ExternalLink
                          href={`${linkEditor(kbaDetail?.view_uri)}`}
                          content={kbaDetail.publishedTitle ? kbaDetail.publishedTitle : `Knowledgebase article`}
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
                    <strong>Additional info</strong>
                  </CardHeader>
                  <CardBody>{<TemplateProcessor template={rule.more_info} definitions={details} onError={handleError} />}</CardBody>
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
