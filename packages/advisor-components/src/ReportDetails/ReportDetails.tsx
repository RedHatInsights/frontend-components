import './ReportDetails.scss';

import React from 'react';
import doT from 'dot';
import { marked } from 'marked';
import { Card, CardBody, CardHeader, Divider, Stack, StackItem } from '@patternfly/react-core';
import { BullseyeIcon, ExternalLinkAltIcon, InfoCircleIcon, LightbulbIcon, ThumbsUpIcon } from '@patternfly/react-icons';

import { RuleContentOcp, RuleContentRhel } from '../types';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components/Skeleton';

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

  const templateProcessor = (template: string, definitions: Record<string, string | number>) => {
    const DOT_SETTINGS = {
      ...doT.templateSettings,
      varname: 'pydata',
      strip: false,
    };
    const externalLinkIcon = '';

    try {
      const compiledDot = definitions ? doT.template(template, DOT_SETTINGS)(definitions) : template;
      const compiledMd = marked(compiledDot);

      return (
        <div
          dangerouslySetInnerHTML={{
            __html: compiledMd
              .replace(/<ul>/gim, `<ul class="pf-c-list" style="font-size: inherit">`)
              .replace(/<a>/gim, `<a> rel="noopener noreferrer" target="_blank"`)
              .replace(/<\/a>/gim, ` ${externalLinkIcon}</a>`),
          }}
        />
      );
    } catch (error) {
      console.warn(error, definitions, template); // eslint-disable-line no-console
      return (
        <React.Fragment>
          {' '}
          Ouch. We were unable to correctly render this text, instead please enjoy the raw data.
          <pre>
            <code>{template}</code>
          </pre>
        </React.Fragment>
      );
    }
  };

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
              <CardBody>{rule.reason && templateProcessor(rule.reason, details)}</CardBody>
            </Card>
          </StackItem>
          <Divider />
          <StackItem>
            <Card className="ins-m-card__flat" isCompact>
              <CardHeader>
                <ThumbsUpIcon className="ins-c-report-details-icon" />
                <strong>Steps to resolve</strong>
              </CardHeader>
              <CardBody>{resolution && templateProcessor(resolution, details)}</CardBody>
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
                  <CardBody>{templateProcessor(rule.more_info, details)}</CardBody>
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
