import './RuleDetails.scss';

import React from 'react';

import { Flex, FlexItem, Icon, Stack, StackItem, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

import InsightsLabel from '@redhat-cloud-services/frontend-components/InsightsLabel';
import { SeverityLine } from '@redhat-cloud-services/frontend-components-charts/SeverityLine';

import RebootRequired from '../RebootRequired/RebootRequired';
import RuleRating from '../RuleRating/RuleRating';
import { AdvisorProduct, Rating, RuleContentOcp, RuleContentRhel } from '../types';
import { RuleDescription } from '../RuleDescription';
import { RuleDetailsMessages } from './RuleDetailsMessages';

export interface RuleDetailsProps {
  messages: RuleDetailsMessages;
  product: AdvisorProduct;
  rule: RuleContentOcp | RuleContentRhel;
  resolutionRisk?: number;
  resolutionRiskDesc?: string;
  header?: React.ReactNode;
  isDetailsPage: boolean;
  children?: React.ReactNode;
  /**
   * onVoteClick - a callback used to update the rating of a particular rule
   * @param {string} ruleId - ID (usually in plugin|error_key format) of the rule that needs to be updated
   * @param {number} newRating rating (-1, 0, 1)
   */
  onVoteClick?: (ruleId: string, calculatedRating: Rating) => unknown;
  knowledgebaseUrl?: string;
  Topics?: React.ReactNode;
  ViewAffectedLink?: React.ReactNode;
}

const RuleDetails: React.FC<RuleDetailsProps> = ({
  messages,
  product,
  header,
  rule,
  isDetailsPage,
  onVoteClick,
  resolutionRisk,
  resolutionRiskDesc,
  children,
  knowledgebaseUrl,
  Topics,
  ViewAffectedLink,
}) => (
  <Flex
    className="ins-c-rule-details"
    flexWrap={{ default: 'nowrap' }}
    direction={{ default: isDetailsPage ? 'column' : 'columnReverse', lg: 'row' }}
  >
    <FlexItem>
      <Stack hasGutter>
        {header && <StackItem className="ins-c-rule-details__header">{header}</StackItem>}
        <StackItem className="ins-c-rule-details__description">
          <RuleDescription product={product} rule={rule} isDetailsPage={isDetailsPage} />
        </StackItem>
        {knowledgebaseUrl && (
          <StackItem className="ins-c-rule-details__kbs">
            <a rel="noopener noreferrer" target="_blank" href={knowledgebaseUrl}>
              {messages.knowledgebaseArticle}&nbsp;
              <Icon size="md">
                <ExternalLinkAltIcon />
              </Icon>
            </a>
          </StackItem>
        )}
        {Topics && <StackItem className="ins-c-rule-details__topics">{Topics}</StackItem>}
        {isDetailsPage && onVoteClick && (
          <StackItem className="ins-c-rule-details__vote">
            <RuleRating messages={messages} ruleId={rule.rule_id} ruleRating={rule.rating} onVoteClick={onVoteClick} />
          </StackItem>
        )}
        {ViewAffectedLink && <StackItem className="ins-c-rule-details__view-affected">{ViewAffectedLink}</StackItem>}
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
                <FlexItem className="ins-c-rule-details__total-risk">
                  {/* remove pf-m-compact class name once https://github.com/patternfly/patternfly-react/issues/7196 is resolved */}
                  <InsightsLabel value={rule.total_risk} isCompact className="pf-m-compact" rest={{}} />
                </FlexItem>
                <FlexItem>
                  <Stack hasGutter>
                    <StackItem className="ins-c-rule-details__total-risk-body">
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
                <FlexItem className={`pf-v5-u-display-inline-flex alignCenterOverride pf-v5-u-pb-sm pf-v5-u-pt-sm`}>
                  <Flex flexWrap={{ default: 'nowrap' }}>
                    <FlexItem>
                      {/* remove pf-m-compact class name once https://github.com/patternfly/patternfly-react/issues/7196 is resolved */}
                      <InsightsLabel
                        text={messages.riskOfChangeLabel}
                        value={resolutionRisk}
                        hideIcon
                        className="ins-c-rule-details__risk-of-ch-label pf-m-compact"
                        rest={{}}
                      />
                    </FlexItem>
                    <FlexItem className="ins-c-rule-details__risk-of-ch-desc">
                      <Stack hasGutter>
                        <StackItem>
                          <TextContent>
                            <Text component={TextVariants.p}>{resolutionRiskDesc}</Text>
                          </TextContent>
                        </StackItem>
                        {product === AdvisorProduct.rhel && (
                          <StackItem className="ins-c-rule-details__reboot">
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

export default RuleDetails;
