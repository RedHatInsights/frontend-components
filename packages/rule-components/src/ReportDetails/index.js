import React from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, Stack, StackItem, Text, Title } from '@patternfly/react-core';
import RuleFeedback, { feedback } from './RuleFeedback';
import Markdown from '../Markdown';
import { totalRiskMeta } from './constants';
import RiskDescription from './RiskDescription';
import { riskOfChangeMeta } from './RiskOfChangeIcon';
import './index.scss';

const ReportDetails = ({
  details,
  ruleId,
  totalRisk,
  riskOfChange,
  showRiskDescription,
  definitions,
  createdAt,
  userVote,
  title,
  actions,
  onFeedbackChanged,
}) => {
  return (
    <Grid className="ins-c-rule__report-detail" hasGutter gutter="md">
      {title && actions && (
        <React.Fragment>
          <GridItem span={8}>
            <Stack>
              <StackItem>{title}</StackItem>
              {createdAt && (
                <StackItem>
                  <Text>Published date: {createdAt}</Text>
                </StackItem>
              )}
            </Stack>
          </GridItem>
          <GridItem span={4} className="ins-c-rule__report-detail-actions">
            {actions}
          </GridItem>
        </React.Fragment>
      )}
      <GridItem span={8}>
        <Stack hasGutter gutter="md">
          <StackItem>
            <div>
              <Markdown template={details} definitions={definitions} />
            </div>
          </StackItem>
          <StackItem>{onFeedbackChanged && <RuleFeedback userVote={userVote} ruleId={ruleId} onFeedbackChanged={onFeedbackChanged} />}</StackItem>
        </Stack>
      </GridItem>

      <GridItem span={4}>
        <Stack hasGutter gutter="md">
          <StackItem>
            <Stack>
              <StackItem>
                <Title headingLevel="h1" className="ins-c-rule__risk-detail-title" size="md">
                  Total risk
                </Title>
              </StackItem>
              <StackItem>
                <RiskDescription riskValue={totalRisk} riskMeta={totalRiskMeta} showDescription={showRiskDescription} />
              </StackItem>
            </Stack>
          </StackItem>
          {riskOfChange > 0 && riskOfChange < 5 && (
            <StackItem>
              <Stack>
                <StackItem>
                  <Title headingLevel="h1" className="ins-c-rule__risk-detail-title" size="md">
                    Risk of change
                  </Title>
                </StackItem>
                <StackItem>
                  <RiskDescription riskValue={riskOfChange} riskMeta={riskOfChangeMeta} showDescription={showRiskDescription} />
                </StackItem>
              </Stack>
            </StackItem>
          )}
        </Stack>
      </GridItem>
    </Grid>
  );
};

ReportDetails.propTypes = {
  details: PropTypes.string,
  ruleId: PropTypes.string,
  totalRisk: PropTypes.number,
  riskOfChange: PropTypes.number,
  userVote: PropTypes.oneOf(Object.values(feedback)),
  showRiskDescription: PropTypes.bool,
  definitions: PropTypes.object,
  createdAt: PropTypes.node,
  title: PropTypes.node,
  actions: PropTypes.node,
  onFeedbackChanged: PropTypes.func,
};

ReportDetails.defaultProps = {
  showRiskDescription: true,
  userVote: 0,
};

export default ReportDetails;
