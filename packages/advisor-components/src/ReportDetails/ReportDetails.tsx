import './ReportDetails.scss';

import React, { useState } from 'react';

import { Alert } from '@patternfly/react-core/dist/dynamic/components/Alert';
import { Card } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardBody } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardHeader } from '@patternfly/react-core/dist/dynamic/components/Card';
import { Divider } from '@patternfly/react-core/dist/dynamic/components/Divider';
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

interface Report {
  rule: RuleContentRhel | RuleContentOcp;
  details: Record<string, string | number>;
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

const ReportDetails: React.FC<ReportDetailsProps> = ({
  report,
  kbaDetail = {
    publishedTitle: 'N/A',
    id: '',
    view_uri: '',
  },
  kbaLoading,
  isProd,
}) => {
  const { rule, details, resolution } = report;
  const [error, setError] = useState<Error | null>(null);

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
          {kbaDetail.publishedTitle !== 'N/A' && (
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
                          content={kbaDetail?.publishedTitle ? kbaDetail?.publishedTitle : `Knowledgebase article`}
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
