import { FormattedMessage, useIntlWithFallback } from '@redhat-cloud-services/frontend-components-translations/localization';
import { riskOfChangeDescriptionFormatters, totalRiskDescriptionFormatters } from './messages';
import React from 'react';
import PropTypes from 'prop-types';
import { Content } from '@patternfly/react-core/dist/dynamic/components/Content';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
import { Grid } from '@patternfly/react-core/dist/dynamic/layouts/Grid';
import { GridItem } from '@patternfly/react-core/dist/dynamic/layouts/Grid';
import { Stack } from '@patternfly/react-core/dist/dynamic/layouts/Stack';
import { StackItem } from '@patternfly/react-core/dist/dynamic/layouts/Stack';
import RuleFeedback, { feedback } from './RuleFeedback';
import Markdown from '../Markdown';
import { totalRiskMeta } from './constants';
import RiskDescription from './RiskDescription';
import { riskOfChangeMeta } from './RiskOfChangeIcon';
import './index.scss';
import messages from '../messages';

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
  const intl = useIntlWithFallback();
  return (
    <Grid className="ins-c-rule__report-detail" hasGutter gutter="md">
      {title && actions && (
        <React.Fragment>
          <GridItem span={8}>
            <Stack>
              <StackItem>{title}</StackItem>
              {createdAt && (
                <StackItem>
                  <Content component="p">
                    <FormattedMessage
                      {...messages.reportDetailsPublishedDate}

                      values={{
                        date: () => <>{createdAt}</>,
                      }}
                    />
                  </Content>
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
                  <FormattedMessage {...messages.reportDetailsTotalRisk} />
                </Title>
              </StackItem>
              <StackItem>
                <RiskDescription
                  riskValue={totalRisk}
                  riskMeta={totalRiskMeta.map((meta, index) => ({
                    ...meta,
                    description: totalRiskDescriptionFormatters[index](intl),
                  }))}
                  showDescription={showRiskDescription}
                />
              </StackItem>
            </Stack>
          </StackItem>
          {riskOfChange > 0 && riskOfChange < 5 && (
            <StackItem>
              <Stack>
                <StackItem>
                  <Title headingLevel="h1" className="ins-c-rule__risk-detail-title" size="md">
                    <FormattedMessage {...messages.reportDetailsRiskOfChange} />
                  </Title>
                </StackItem>
                <StackItem>
                  <RiskDescription
                    riskValue={riskOfChange}
                    riskMeta={riskOfChangeMeta.map((meta, index) => ({
                      ...meta,
                      description: riskOfChangeDescriptionFormatters[index](intl),
                    }))}
                    showDescription={showRiskDescription}
                  />
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
