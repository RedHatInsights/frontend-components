import './RuleDetails.scss';

import React from 'react';
import { useIntl } from 'react-intl';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

import { Flex, FlexItem, Stack, StackItem, Text, TextContent, TextVariants } from '@patternfly/react-core';
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/js/icons/external-link-alt-icon';

import InsightsLabel from '@redhat-cloud-services/frontend-components/InsightsLabel';
import { SeverityLine } from '@redhat-cloud-services/frontend-components-charts/SeverityLine';

import { IMPACT_LABEL_KEY, LIKELIHOOD_LABEL_KEY, RISK_OF_CHANGE_LABEL_KEY, TOTAL_RISK_LABEL_KEY } from '../constants';
import RebootRequired from '../RebootRequired/RebootRequired';
import RuleRating from '../RuleRating/RuleRating';
import ContextWrapper, { ContextWrapperProps } from '../ContextWrapper';
import messages from '../messages';
import { barDividedList, topicLinks } from '../common';
import { AdvisorProduct, Likelihood, Rating, RiskOfChange, RuleContentOcp, RuleContentRhel, TopicRhel } from '../types';

interface RuleDetailsBaseProps {
  product: AdvisorProduct;
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
  showViewAffected?: boolean;
  linkComponent?: any;
}

interface RuleDetailsProps extends RuleDetailsBaseProps, ContextWrapperProps {}

const RuleDetailsBase: React.FC<RuleDetailsBaseProps> = (props) => {
  const intl = useIntl();
  const {
    product,
    header,
    rule,
    isDetailsPage,
    topics,
    onVoteClick,
    showViewAffected,
    resolutionRisk,
    resolutionRiskDesc,
    children,
    linkComponent: Link,
  } = props;

  const renderDescription = () => {
    const ruleDescription = (data: string, isGeneric = false) =>
      typeof data === 'string' &&
      Boolean(data) && (
        <span className={isGeneric ? 'genericOverride' : ''}>
          <Markdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>{data}</Markdown>
        </span>
      );

    if (product === AdvisorProduct.ocp) {
      return ruleDescription(rule.generic, true);
    } else {
      // RHEL rule
      return isDetailsPage ? ruleDescription(rule.generic, true) : ruleDescription(rule.summary);
    }
  };

  const renderViewAffected = () => {
    if (product === AdvisorProduct.ocp) {
      if ((rule as RuleContentOcp).impacted_clusters_count > 0) {
        return (
          <StackItem>
            <Link key={`${rule.rule_id}-link`} to={`/recommendations/${rule.rule_id}`}>
              {intl.formatMessage(messages.viewAffectedClusters, {
                clusters: (rule as RuleContentOcp).impacted_clusters_count,
              })}
            </Link>
          </StackItem>
        );
      }
    } else {
      // RHEL rule
      if ((rule as RuleContentRhel).impacted_systems_count > 0) {
        return (
          <StackItem>
            <Link key={`${rule.rule_id}-link`} to={`/recommendations/${rule.rule_id}`}>
              {intl.formatMessage(messages.viewAffectedSystems, {
                systems: (rule as RuleContentRhel).impacted_systems_count,
              })}
            </Link>
          </StackItem>
        );
      }
    }
  };

  return (
    <Flex flexWrap={{ default: 'nowrap' }} direction={{ default: isDetailsPage ? 'column' : 'columnReverse', lg: 'row' }}>
      <FlexItem>
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
          {topics && rule.tags && topicLinks(rule as RuleContentRhel, topics, Link).length > 0 && (
            <StackItem>
              <strong>{intl.formatMessage(messages.topicRelatedToRule)}</strong>
              <br />
              {barDividedList(topicLinks(rule as RuleContentRhel, topics, Link))}
            </StackItem>
          )}
          {isDetailsPage && onVoteClick && <RuleRating ruleId={rule.rule_id} ruleRating={rule.rating} onVoteClick={onVoteClick} />}
          {!isDetailsPage && showViewAffected && Link && renderViewAffected()}
        </Stack>
      </FlexItem>
      <FlexItem align={{ lg: 'alignRight' }}>
        <Stack>
          {children && <StackItem>{children}</StackItem>}
          <StackItem>
            <Flex className="ins-c-rule-details__stack" direction={{ default: 'column' }}>
              <FlexItem spacer={{ default: 'spacerSm' }}>
                <strong>{intl.formatMessage(messages.totalRisk)}</strong>
              </FlexItem>
              <FlexItem>
                <Flex flexWrap={{ default: 'nowrap' }}>
                  <FlexItem>
                    <InsightsLabel value={rule.total_risk} rest={{}} />
                  </FlexItem>
                  <FlexItem className="ins-c-description-stack-override">
                    <Stack hasGutter>
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
                            className="ins-c-severity-line"
                            title={intl.formatMessage(messages.likelihoodLevel, {
                              level: intl.formatMessage(messages[LIKELIHOOD_LABEL_KEY[rule.likelihood as Likelihood]]),
                            })}
                            value={rule.likelihood}
                            tooltipMessage={intl.formatMessage(messages.likelihoodDescription, {
                              level: intl.formatMessage(messages[LIKELIHOOD_LABEL_KEY[rule.likelihood as Likelihood]]).toLowerCase(),
                            })}
                          />
                        </StackItem>
                        <StackItem>
                          <SeverityLine
                            className="ins-c-severity-line"
                            title={intl.formatMessage(messages.impactLevel, {
                              level: intl.formatMessage(messages[IMPACT_LABEL_KEY[(rule as RuleContentRhel).impact.impact]]),
                            })}
                            value={(rule as RuleContentRhel).impact.impact}
                            tooltipMessage={intl.formatMessage(messages.impactDescription, {
                              level: intl.formatMessage(messages[IMPACT_LABEL_KEY[(rule as RuleContentRhel).impact.impact]]).toLowerCase(),
                            })}
                          />
                        </StackItem>
                      </Stack>
                    </Stack>
                  </FlexItem>
                </Flex>
              </FlexItem>
              {resolutionRisk && resolutionRiskDesc && (
                <React.Fragment>
                  <hr></hr>
                  <FlexItem>
                    <strong>{intl.formatMessage(messages.riskOfChange)}</strong>
                  </FlexItem>
                  <FlexItem className={`pf-u-display-inline-flex alignCenterOverride pf-u-pb-sm pf-u-pt-sm`}>
                    <span className="ins-c-rule-details__stackitem">
                      <span>
                        <InsightsLabel
                          text={intl.formatMessage(messages[RISK_OF_CHANGE_LABEL_KEY[resolutionRisk as RiskOfChange]])}
                          value={resolutionRisk}
                          hideIcon
                          rest={{}}
                        />
                      </span>
                      <Stack hasGutter className="ins-c-description-stack-override">
                        <StackItem>
                          <TextContent>
                            <Text component={TextVariants.p}>{resolutionRiskDesc}</Text>
                          </TextContent>
                        </StackItem>
                        {product === AdvisorProduct.rhel && (
                          <StackItem>
                            <RebootRequired rebootRequired={(rule as RuleContentRhel).reboot_required} />
                          </StackItem>
                        )}
                      </Stack>
                    </span>
                  </FlexItem>
                </React.Fragment>
              )}
            </Flex>
          </StackItem>
        </Stack>
      </FlexItem>
    </Flex>
  );
};

const RuleDetails: React.FC<RuleDetailsProps> = ({ ...props }) => (
  <ContextWrapper>
    <RuleDetailsBase {...props} />
  </ContextWrapper>
);

export default RuleDetails;
