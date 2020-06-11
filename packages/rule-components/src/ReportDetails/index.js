import React from 'react';
import PropTypes from 'prop-types';
import {
    Grid,
    GridItem,
    Stack,
    StackItem,
    Title
} from '@patternfly/react-core';
import RuleFeedback, { feedback } from './RuleFeedback';
import Markdown from './Markdown';
import { riskOfChangeMeta, totalRiskMeta } from './constants';
import RiskDescription from './RiskDescription';
import RemediatingModal from './RemediatingModal';
import doT from 'dot';

export { default as style } from './index.scss';

const templateProcessor = (template, definitions) => (
    definitions
        ? doT.template(template, {
            ...doT.templateSettings,
            varname: [ 'pydata' ],
            strip: false
        })(definitions)
        : template
);

const ReportDetails = (
    {
        details,
        ruleId,
        totalRisk,
        riskOfChange,
        showRiskDescription,
        remediating,
        definitions,
        userVote,
        onFeedbackChanged
    }) => {

    return <Grid hasGutter className="ins-c-rule__report-detail">
        <GridItem span={ 7 }>
            <Stack hasGutter>
                <StackItem>
                    <div>
                        <Markdown
                            template={ details }
                            definitions={ definitions }
                        />
                    </div>
                    <div>
                        {
                            remediating && <RemediatingModal
                                reason={ remediating.reason }
                                resolution={ remediating.resolution }
                                definitions={ definitions }
                            />
                        }
                    </div>
                </StackItem>
                <StackItem>
                    {
                        onFeedbackChanged &&
                        <RuleFeedback
                            userVote={ userVote }
                            ruleId={ ruleId }
                            onFeedbackChanged={ onFeedbackChanged }
                        />
                    }
                </StackItem>
            </Stack>
        </GridItem>

        <GridItem span={ 3 }>
            <Stack hasGutter>
                <StackItem>
                    <Stack>
                        <StackItem>
                            <Title headingLevel="h1" className="ins-c-rule__risk-detail-title" size="md">Total risk</Title>
                        </StackItem>
                        <StackItem>
                            <RiskDescription
                                riskValue={ totalRisk }
                                riskMeta={ totalRiskMeta }
                                showDescription={ showRiskDescription }
                            />
                        </StackItem>
                    </Stack>
                </StackItem>
                {
                    riskOfChange > 0 && riskOfChange < 5 &&
                    <StackItem>
                        <Stack>
                            <StackItem>
                                <Title headingLevel="h1" className="ins-c-rule__risk-detail-title" size="md">Risk of change</Title>
                            </StackItem>
                            <StackItem>
                                <RiskDescription
                                    riskValue={ riskOfChange }
                                    riskMeta={ riskOfChangeMeta }
                                    showDescription={ showRiskDescription }
                                />
                            </StackItem>
                        </Stack>
                    </StackItem>
                }
            </Stack>
        </GridItem>
    </Grid>;
};

ReportDetails.propTypes = {
    details: PropTypes.string,
    ruleId: PropTypes.string,
    totalRisk: PropTypes.number,
    riskOfChange: PropTypes.number,
    userVote: PropTypes.oneOf(Object.values(feedback)),
    showRiskDescription: PropTypes.bool,
    definitions: PropTypes.object,
    remediating: PropTypes.shape({
        reason: PropTypes.string,
        resolution: PropTypes.string
    }),
    onFeedbackChanged: PropTypes.func
};

ReportDetails.defaultProps = {
    showRiskDescription: true,
    userVote: 0
};

export default ReportDetails;
