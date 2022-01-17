import './report-details.scss';

import { BullseyeIcon, ExternalLinkAltIcon, InfoCircleIcon, LightbulbIcon, ThumbsUpIcon } from '@patternfly/react-icons';
import { Card, CardBody, CardHeader, Stack, StackItem } from '@patternfly/react-core';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components/Skeleton';

import React from 'react';
import classNames from 'classnames';
import doT from 'dot';
import marked from 'marked';
import propTypes from 'prop-types';
import sanitizeHtml from 'sanitize-html';

const ReportDetails = ({ report, kbaDetail, kbaLoading }) => {
  const rule = report.rule || report;
  const rulesCardClasses = classNames('ins-c-inventory-advisor__card', 'ins-c-rules-card');
  const templateProcessor = (template, definitions) => {
    const DOT_SETTINGS = { ...doT.templateSettings, varname: ['pydata'], strip: false };
    const sanitizeOptions = {
      allowedAttributes: { ...sanitizeHtml.defaults.allowedAttributes, '*': ['style'] },
      transformTags: {
        ul(tagName, attribs) {
          return {
            tagName: 'ul',
            attribs: { class: 'pf-c-list' },
          };
        },
      },
      textFilter(text) {
        return text.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<');
      },
    };
    const externalLinkIcon = '';

    try {
      const compiledDot = definitions ? doT.template(template, DOT_SETTINGS)(definitions) : template;
      const compiledMd = marked(sanitizeHtml(compiledDot, sanitizeOptions));

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
        <Stack className={rulesCardClasses} widget-type="InsightsRulesCard" hasGutter>
          <StackItem>
            <Card className="ins-m-card__flat">
              <CardHeader>
                <BullseyeIcon className="ins-c-report-details-icon" />
                <strong> Detected issues</strong>
              </CardHeader>
              <CardBody>{rule.reason && templateProcessor(rule.reason, report.details)}</CardBody>
            </Card>
          </StackItem>
          <StackItem>
            <Card className="ins-m-card__flat">
              <CardHeader>
                <ThumbsUpIcon className="ins-c-report-details-icon" />
                <strong> Steps to resolve</strong>
              </CardHeader>
              <CardBody>{report.resolution && templateProcessor(report.resolution.resolution, report.details)}</CardBody>
            </Card>
          </StackItem>
          {rule.node_id && (
            <StackItem>
              <Card className="ins-m-card__flat">
                <CardHeader>
                  <LightbulbIcon className="ins-c-report-details-icon" />
                  <strong> Related Knowledgebase article </strong>
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
          )}
          {rule.more_info && (
            <StackItem>
              <Card className="ins-m-card__flat">
                <CardHeader>
                  <InfoCircleIcon className="ins-c-report-details-icon" />
                  <strong> Additional info </strong>
                </CardHeader>
                <CardBody>{templateProcessor(rule.more_info, report.details)}</CardBody>
              </Card>
            </StackItem>
          )}
        </Stack>
      </CardBody>
    </Card>
  );
};

export default ReportDetails;

ReportDetails.defaultProps = {
  report: {},
  kbaDetail: {},
};

ReportDetails.propTypes = {
  report: propTypes.object,
  kbaDetail: propTypes.object,
  kbaLoading: propTypes.bool,
};
