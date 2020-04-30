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
        definitions,
        onFeedbackChanged
    }) => {

    return <Grid gutter="md" className="ins-c-rule__report-detail">
        <GridItem span={ 7 }>
            <Stack gutter="md">
                <StackItem>
                    <div>
                        <ReactMarkdown
                            source={ templateProcessor(details, definitions) }
                            renderers={ {
                                link: LinkInDetails
                            } }
                        />
                    </div>
                </StackItem>
                <StackItem>
                    {
                        onFeedbackChanged &&
                        <RuleFeedback ruleId={ ruleId } onFeedbackChanged={ onFeedbackChanged }/>
                    }
                </StackItem>
            </Stack>
        </GridItem>

        <GridItem span={ 3 }>
            <Stack gutter="md">
                <StackItem>
                    <Stack>
                        <StackItem>
                            <Title className="ins-c-rule__risk-detail-title" size="md">Total risk</Title>
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
                                <Title className="ins-c-rule__risk-detail-title" size="md">Risk of change</Title>
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
    showRiskDescription: PropTypes.bool,
    definitions: PropTypes.object,
    onFeedbackChanged: PropTypes.func
};

ReportDetails.defaultProps = {
    showRiskDescription: true
};

export default ReportDetails;
