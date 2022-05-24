import './ReportDetails.scss';

import React from 'react';

import { Card, CardBody, CardHeader, Divider, Stack, StackItem } from '@patternfly/react-core';
import { BullseyeIcon, ExternalLinkAltIcon, InfoCircleIcon, LightbulbIcon, ThumbsUpIcon } from '@patternfly/react-icons';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components/Skeleton';

import { RuleContentOcp, RuleContentRhel } from '../types';
import { TemplateProcessor } from '../TemplateProcessor';

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
  kbaLoading: boolean;
}

const ReportDetails: React.FC<ReportDetailsProps> = ({ report, kbaDetail, kbaLoading }) => {
  const { rule, details, resolution } = report;

  return (
    <Card className="ins-c-inventory-insights__report-details__override" style={{ boxShadow: 'none' }}>
      <CardBody>
        <Stack className="ins-c-inventory-advisor__card ins-c-rules-card" widget-type="InsightsRulesCard" hasGutter>
          <StackItem>
            <Card className="ins-m-card__flat" isCompact>
              <CardHeader>
                <BullseyeIcon className="ins-c-report-details-icon" />
                <strong>Detected issues</strong>
              </CardHeader>
              <CardBody>{rule.reason && <TemplateProcessor template={rule.reason} definitions={details} />}</CardBody>
            </Card>
          </StackItem>
          <Divider />
          <StackItem>
            <Card className="ins-m-card__flat" isCompact>
              <CardHeader>
                <ThumbsUpIcon className="ins-c-report-details-icon" />
                <strong>Steps to resolve</strong>
              </CardHeader>
              <CardBody>{resolution && <TemplateProcessor template={resolution} definitions={details} />}</CardBody>
            </Card>
          </StackItem>
          {(rule as RuleContentRhel).node_id && (
            <React.Fragment>
              <Divider />
              <StackItem>
                <Card className="ins-m-card__flat" isCompact>
                  <CardHeader>
                    <LightbulbIcon className="ins-c-report-details-icon" />
                    <strong>Related Knowledgebase article</strong>
                  </CardHeader>
                  <CardBody>
                    {kbaLoading ? (
                      <Skeleton size={SkeletonSize.sm} />
                    ) : (
                      <a rel="noopener noreferrer" target="_blank" href={`${kbaDetail.view_uri}`}>
                        {kbaDetail.publishedTitle ? kbaDetail.publishedTitle : `Knowledgebase article`} <ExternalLinkAltIcon />
                      </a>
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
                <Card className="ins-m-card__flat" isCompact>
                  <CardHeader>
                    <InfoCircleIcon className="ins-c-report-details-icon" />
                    <strong>Additional info</strong>
                  </CardHeader>
                  <CardBody>{<TemplateProcessor template={rule.more_info} definitions={details} />}</CardBody>
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
