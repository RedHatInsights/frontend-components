import './RuleDetails.scss';

import React from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

import { Flex, FlexItem, Stack, StackItem, Text, TextContent, TextVariants } from '@patternfly/react-core';
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/js/icons/external-link-alt-icon';

import InsightsLabel from '@redhat-cloud-services/frontend-components/InsightsLabel';
import { SeverityLine } from '@redhat-cloud-services/frontend-components-charts/SeverityLine';

import RebootRequired from '../RebootRequired/RebootRequired';
import RuleRating from '../RuleRating/RuleRating';
import { barDividedList, topicLinks } from '../common';
import { AdvisorProduct, Rating, RuleContentOcp, RuleContentRhel, TopicRhel } from '../types';

export const RuleDetailsMessagesKeys = [
  'systemReboot',
  'viewAffectedSystems',
  'viewAffectedClusters',
  'knowledgebaseArticle',
  'topicRelatedToRule',
  'totalRisk',
  'rulesDetailsTotalRiskBody',
  'likelihoodLevel',
  'likelihoodDescription',
  'impactLevel',
  'impactDescription',
  'ruleHelpful',
  'feedbackThankYou',
  'riskOfChange',
  'riskOfChangeText',
  'riskOfChangeLabel',
];

export type RuleDetailsMessages = {
  systemReboot: string;
  // RHEL
  viewAffectedSystems?: string;
  // OCP
  viewAffectedClusters?: string;
  knowledgebaseArticle: string;
  topicRelatedToRule: string;
  totalRisk: string;
  rulesDetailsTotalRiskBody: string;
  likelihoodLevel: string;
  likelihoodDescription: string;
  impactLevel: string;
  impactDescription: string;
  riskOfChange: string;
  riskOfChangeText: string;
  riskOfChangeLabel: string;
  ruleHelpful: string;
  feedbackThankYou: string;
};

interface RuleDetailsProps {
  messages: RuleDetailsMessages;
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
  knowledgebaseUrl?: string;
}

const RuleDetails: React.FC<RuleDetailsProps> = (props) => {
  const {
    messages,
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
    knowledgebaseUrl,
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
              {messages.viewAffectedClusters}
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
              {messages.viewAffectedSystems}
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
          {knowledgebaseUrl && (
            <StackItem>
              <a rel="noopener noreferrer" target="_blank" href={knowledgebaseUrl}>
                {messages.knowledgebaseArticle}&nbsp;
                <ExternalLinkAltIcon size="sm" />
              </a>
            </StackItem>
          )}
          {topics && rule.tags && topicLinks(rule as RuleContentRhel, topics, Link).length > 0 && (
            <StackItem>
              <strong>{messages.topicRelatedToRule}</strong>
              <br />
              {barDividedList(topicLinks(rule as RuleContentRhel, topics, Link))}
            </StackItem>
          )}
          {isDetailsPage && onVoteClick && (
            <RuleRating messages={messages} ruleId={rule.rule_id} ruleRating={rule.rating} onVoteClick={onVoteClick} />
          )}
          {!isDetailsPage && showViewAffected && Link && renderViewAffected()}
        </Stack>
      </FlexItem>
      <FlexItem align={{ lg: 'alignRight' }}>
        <Stack>
          {children && <StackItem>{children}</StackItem>}
          <StackItem>
            <Flex className="ins-c-rule-details__stack" direction={{ default: 'column' }}>
              <FlexItem spacer={{ default: 'spacerSm' }}>
                <strong>{messages.totalRisk}</strong>
              </FlexItem>
              <FlexItem>
                <Flex flexWrap={{ default: 'nowrap' }}>
                  <FlexItem>
                    <InsightsLabel value={rule.total_risk} isCompact rest={{}} />
                  </FlexItem>
                  <FlexItem className="ins-c-description-stack-override">
                    <Stack hasGutter>
                      <StackItem>
                        <TextContent>
                          <Text component={TextVariants.p}>{messages.rulesDetailsTotalRiskBody}</Text>
                        </TextContent>
                      </StackItem>
                      <Stack>
                        <StackItem>
                          <SeverityLine
                            className="ins-c-severity-line"
                            title={messages.likelihoodLevel}
                            value={rule.likelihood}
                            tooltipMessage={messages.likelihoodDescription}
                          />
                        </StackItem>
                        <StackItem>
                          <SeverityLine
                            className="ins-c-severity-line"
                            title={messages.impactLevel}
                            value={(rule as RuleContentRhel).impact.impact}
                            tooltipMessage={messages.impactDescription}
                          />
                        </StackItem>
                      </Stack>
                    </Stack>
                  </FlexItem>
                </Flex>
              </FlexItem>
              {resolutionRisk && resolutionRiskDesc && (
                <React.Fragment>
                  <span className="ins-c-line" />
                  <FlexItem spacer={{ default: 'spacerSm' }}>
                    <strong>{messages.riskOfChange}</strong>
                  </FlexItem>
                  <FlexItem className={`pf-u-display-inline-flex alignCenterOverride pf-u-pb-sm pf-u-pt-sm`}>
                    <Flex flexWrap={{ default: 'nowrap' }}>
                      <FlexItem>
                        <InsightsLabel text={messages.riskOfChangeLabel} value={resolutionRisk} hideIcon isCompact rest={{}} />
                      </FlexItem>
                      <FlexItem className="ins-c-description-stack-override">
                        <Stack hasGutter>
                          <StackItem>
                            <TextContent>
                              <Text component={TextVariants.p}>{resolutionRiskDesc}</Text>
                            </TextContent>
                          </StackItem>
                          {product === AdvisorProduct.rhel && (
                            <StackItem>
                              <RebootRequired messages={messages} rebootRequired={(rule as RuleContentRhel).reboot_required} />
                            </StackItem>
                          )}
                        </Stack>
                      </FlexItem>
                    </Flex>
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

export default RuleDetails;
