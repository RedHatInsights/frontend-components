import React from 'react';
import PropTypes from 'prop-types';
import {
    Grid,
    GridItem,
    Stack,
    StackItem,
    Title
} from '@patternfly/react-core';
import RuleFeedback from './RuleFeedback';
import ReactMarkdown from 'react-markdown';
import { riskOfChangeMeta, totalRiskMeta } from './constants';
import LinkInDetails from './LinkInDetails';
import RiskDescription from './RiskDescription';

export { default as style } from './index.scss';

const ReportDetails = (
    {
        details,
        ruleId,
        totalRisk,
        riskOfChange
    }) => (

    <Grid gutter="md" className="ins-c-rule__report-detail">
        <GridItem span={ 7 }>
            <Stack gutter="md">
                <StackItem>
                    <div>
                        <div className="testclassname">test</div>
                        <ReactMarkdown
                            source={ details }
                            renderers={ {
                                link: LinkInDetails
                            } }
                        />
                    </div>
                </StackItem>
                <StackItem>
                    <RuleFeedback ruleId={ ruleId }/>
                </StackItem>
            </Stack>
        </GridItem>

        <GridItem span={ 3 }>
            <Stack gutter="md">
                <StackItem>
                    <Stack>
                        <StackItem>
                            <Title className="ins-c-rule__risk-detail" size="md">Total risk</Title>
                        </StackItem>
                        <StackItem>
                            <RiskDescription riskValue={ totalRisk } riskMeta={ totalRiskMeta }/>
                        </StackItem>
                    </Stack>
                </StackItem>
                <StackItem>
                    <Stack>
                        <StackItem>
                            <Title className="ins-c-rule__risk-detail" size="md">Risk of change</Title>
                        </StackItem>
                        <StackItem>
                            <RiskDescription riskValue={ riskOfChange } riskMeta={ riskOfChangeMeta }/>
                        </StackItem>
                    </Stack>
                </StackItem>
            </Stack>
        </GridItem>
    </Grid>
);

ReportDetails.propTypes = {
    details: PropTypes.string,
    ruleId: PropTypes.number,
    totalRisk: PropTypes.number,
    riskOfChange: PropTypes.number
};

export default ReportDetails;
