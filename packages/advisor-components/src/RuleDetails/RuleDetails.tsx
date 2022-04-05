import './RuleDetails.scss';

import React, { MouseEventHandler, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

import { Split, SplitItem, Stack, StackItem, Text, TextContent, TextVariants } from '@patternfly/react-core';
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/js/icons/external-link-alt-icon';

import InsightsLabel from '@redhat-cloud-services/frontend-components/InsightsLabel';
import { SeverityLine } from '@redhat-cloud-services/frontend-components-charts/SeverityLine';

import { IMPACT_LABEL_KEY, LIKELIHOOD_LABEL_KEY, RISK_OF_CHANGE_LABEL_KEY, TOTAL_RISK_LABEL_KEY } from '../constants';
import RebootRequired from '../RebootRequired/RebootRequired';
import RuleRating from '../RuleRating/RuleRating';
import ContextWrapper, { ContextWrapperProps, ProductContext } from '../ContextWrapper';
import messages from '../messages';
import { barDividedList, topicLinks } from '../common';
import { RiskOfChange } from '../types';
import { Likelihood } from '../types';
import { TopicRhel } from '../types';
import { Rating } from '../types';
import { RuleContentOcp } from '../types';
import { RuleContentRhel } from '../types';
import { AdvisorProduct } from '../types';
import { string } from 'prop-types';

interface RuleDetailsBaseProps {
  rule: RuleContentOcp | RuleContentRhel;
  resolutionRisk?: number;
  resolutionRiskDesc?: string;
  header?: React.ReactNode;
  isDetailsPage: boolean;
  topics: TopicRhel[];
  /**
   * onVoteClick - a callback used to update the rating of a particular rule
   * @param {string} ruleId - ID (usually in plugin|error_key format) of the rule that needs to be updated
   * @param {number} newRating rating (-1, 0, 1)
   */
  onVoteClick?: (ruleId: string, calculatedRating: Rating) => unknown;
  onViewAffectedClick?: (ruleId: string) => unknown;
}

interface RuleDetailsProps extends RuleDetailsBaseProps, ContextWrapperProps {}

const RuleDetailsBase: React.FC<RuleDetailsBaseProps> = (props) => {
  const intl = useIntl();
  const product = useContext(ProductContext);
  const { header, rule, isDetailsPage, topics, onVoteClick, onViewAffectedClick, resolutionRisk, resolutionRiskDesc, children } = props;

  const renderDescription = () => {
    const ruleDescription = (data: string, isGeneric = false) =>
      typeof data === 'string' &&
      Boolean(data) && (
        <span className={isGeneric ? 'genericOverride' : ''}>
          <Markdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>{data}</Markdown>
        </span>
      );

    switch (product) {
      case AdvisorProduct.ocp:
        return ruleDescription(rule.generic, true);
        break;
      case AdvisorProduct.rhel:
        return isDetailsPage ? ruleDescription(rule.generic, true) : ruleDescription(rule.summary);
    }
  };

  const renderViewAffected = () => {
    switch (product) {
      case AdvisorProduct.ocp:
        if ((rule as RuleContentOcp).impacted_clusters_count > 0) {
          return (
            <StackItem>
              <Link key={`${rule.rule_id}-link`} onClick={() => onViewAffectedClick && onViewAffectedClick(rule.rule_id)} to="#">
                {intl.formatMessage(messages.viewAffectedClusters, {
                  clusters: (rule as RuleContentOcp).impacted_clusters_count,
                })}
              </Link>
            </StackItem>
          );
        }
        break;
      case AdvisorProduct.rhel:
        if ((rule as RuleContentRhel).impacted_systems_count > 0) {
          return (
            <StackItem>
              <Link key={`${rule.rule_id}-link`} onClick={() => onViewAffectedClick && onViewAffectedClick(rule.rule_id)} to="#">
                {intl.formatMessage(messages.viewAffectedSystems, {
                  systems: (rule as RuleContentRhel).impacted_systems_count,
                })}
              </Link>
            </StackItem>
          );
        }
    }
  };

  const renderImpactSeverityLine = () => {
    switch (product) {
      case AdvisorProduct.ocp:
        return (
          <SeverityLine
            className="severity-line"
            title={intl.formatMessage(messages.impactLevel, {
              level: intl.formatMessage(messages[IMPACT_LABEL_KEY[(rule as RuleContentOcp).impact]]),
            })}
            value={(rule as RuleContentOcp).impact}
            tooltipMessage={intl.formatMessage(messages.impactDescription, {
              level: intl.formatMessage(messages[IMPACT_LABEL_KEY[(rule as RuleContentOcp).impact]]).toLowerCase(),
            })}
          />
        );
        break;
      case AdvisorProduct.rhel:
        return (
          <SeverityLine
            className="severity-line"
            title={intl.formatMessage(messages.impactLevel, {
              level: intl.formatMessage(messages[IMPACT_LABEL_KEY[(rule as RuleContentRhel).impact.impact]]),
            })}
            value={(rule as RuleContentRhel).impact.impact}
            tooltipMessage={intl.formatMessage(messages.impactDescription, {
              level: intl.formatMessage(messages[IMPACT_LABEL_KEY[(rule as RuleContentRhel).impact.impact]]).toLowerCase(),
            })}
          />
        );
    }
  };

  return (
    <Split className="ins-c-rule-details__split" hasGutter>
      <SplitItem>
        <Stack hasGutter>
          {header && <StackItem>{header}</StackItem>}
          <StackItem>{renderDescription()}</StackItem>
          {(rule as RuleContentRhel).node_id && (
            <StackItem>
              <a rel="noopener noreferrer" target="_blank" href={`https://access.redhat.com/node/${(rule as RuleContentRhel).node_id}`}>
                {intl.formatMessage(messages.knowledgebaseArticle)}&nbsp;
                <ExternalLinkAltIcon size="sm" />
              </a>
            </StackItem>
          )}
          {topics && rule.tags && topicLinks(rule as RuleContentRhel, topics).length > 0 && (
            <StackItem>
              <strong>{intl.formatMessage(messages.topicRelatedToRule)}</strong>
              <br />
              {barDividedList(topicLinks(rule as RuleContentRhel, topics))}
            </StackItem>
          )}
          {isDetailsPage && onVoteClick && <RuleRating {...{ ruleId: rule.rule_id, ruleRating: rule.rating, onVoteClick }} />}
          {!isDetailsPage && onViewAffectedClick && renderViewAffected()}
        </Stack>
      </SplitItem>
      <SplitItem>
        <Stack>
          {children && <StackItem>{children}</StackItem>}
          <StackItem>
            <Stack className="ins-c-rule-details__stack">
              <StackItem>
                <strong>{intl.formatMessage(messages.totalRisk)}</strong>
              </StackItem>
              <StackItem className="pf-u-display-inline-flex alignCenterOverride pf-u-pb-sm pf-u-pt-sm">
                <span className="ins-c-rule-details__stackitem">
                  <span>
                    <InsightsLabel value={rule.total_risk} rest={{}} />
                  </span>
                  <Stack hasGutter className="description-stack-override">
                    <StackItem>
                      <TextContent>
                        <Text component={TextVariants.p}>
                          {intl.formatMessage(messages.rulesDetailsTotalRiskBody, {
                            risk: intl.formatMessage(messages[TOTAL_RISK_LABEL_KEY[rule.total_risk]] || messages.undefined).toLowerCase(),
                            strong: (str) => <strong>{str}</strong>,
                          })}
                        </Text>
                      </TextContent>
                    </StackItem>
                    <Stack>
                      <StackItem>
                        <SeverityLine
                          className="severity-line"
                          title={intl.formatMessage(messages.likelihoodLevel, {
                            level: intl.formatMessage(messages[LIKELIHOOD_LABEL_KEY[rule.likelihood as Likelihood]]),
                          })}
                          value={rule.likelihood}
                          tooltipMessage={intl.formatMessage(messages.likelihoodDescription, {
                            level: intl.formatMessage(messages[LIKELIHOOD_LABEL_KEY[rule.likelihood as Likelihood]]).toLowerCase(),
                          })}
                        />
                      </StackItem>
                      <StackItem>{renderImpactSeverityLine()}</StackItem>
                    </Stack>
                  </Stack>
                </span>
              </StackItem>
              {resolutionRisk && resolutionRiskDesc && (
                <React.Fragment>
                  <hr></hr>
                  <StackItem>
                    <strong>{intl.formatMessage(messages.riskOfChange)}</strong>
                  </StackItem>
                  <StackItem className={`pf-u-display-inline-flex alignCenterOverride pf-u-pb-sm pf-u-pt-sm`}>
                    <span className="ins-c-rule-details__stackitem">
                      <span>
                        <InsightsLabel
                          text={intl.formatMessage(messages[RISK_OF_CHANGE_LABEL_KEY[resolutionRisk as RiskOfChange]])}
                          value={resolutionRisk}
                          hideIcon
                          rest={{}}
                        />
                      </span>
                      <Stack hasGutter className="description-stack-override">
                        <StackItem>
                          <TextContent>
                            <Text component={TextVariants.p}>{resolutionRiskDesc}</Text>
                          </TextContent>
                        </StackItem>
                        {product === AdvisorProduct.rhel && (
                          <StackItem>
                            <RebootRequired reboot_required={(rule as RuleContentRhel).reboot_required} />
                          </StackItem>
                        )}
                      </Stack>
                    </span>
                  </StackItem>
                </React.Fragment>
              )}
            </Stack>
          </StackItem>
        </Stack>
      </SplitItem>
    </Split>
  );
};

const RuleDetails: React.FC<RuleDetailsProps> = ({ routerProps, env, ...props }) => (
  <ContextWrapper {...{ routerProps, env }}>
    <RuleDetailsBase {...props} />
  </ContextWrapper>
);

export default RuleDetails;
