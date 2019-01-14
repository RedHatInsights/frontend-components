import React from 'react';
import propTypes from 'prop-types';
import classNames from 'classnames';
import {
    ChevronRightIcon,
    ChevronDownIcon,
    ThumbsUpIcon,
    BullseyeIcon,
    LightbulbIcon
} from '@patternfly/react-icons';
import { Ansible } from '../../../../PresentationalComponents/Ansible';
import { Battery } from '../../../../PresentationalComponents/Battery';
import { Card, CardBody, CardHeader, Grid, GridItem, List, ListItem, Split, SplitItem } from '@patternfly/react-core';
import ReactMarkdown from 'react-markdown/with-html';

class ExpandableRulesCard extends React.Component {
    state = {
        expanded: true,
        kbaDetail: {}
    }

    componentDidUpdate(prevProps) {
        if (this.props.isExpanded !== prevProps.isExpanded) {
            this.setState({ expanded: this.props.isExpanded });
        }

        if (this.props.kbaDetails !== prevProps.kbaDetails) {
            this.setState({ kbaDetail: this.props.kbaDetails.filter(article => article.id === this.props.report.rule.node_id) });
        }
    }

    toggleExpanded = () => {
        this.setState({ expanded: !this.state.expanded });
    }

    render() {
        const { report } = this.props;
        const rule = report.rule || report;
        const { expanded, kbaDetail } = this.state;

        let rulesCardClasses = classNames(
            'ins-c-rules-card',
            'pf-t-light',
            'pf-m-opaque-100'
        );
        return (
            <Card className={ rulesCardClasses } widget-type='InsightsRulesCard'>
                <CardHeader>
                    <Split onClick={ this.toggleExpanded }>
                        <SplitItem>
                            { !expanded && <ChevronRightIcon /> } { expanded && <ChevronDownIcon /> }
                        </SplitItem>
                        <SplitItem> { rule.category.name } &gt; </SplitItem>
                        <SplitItem isMain> { rule.description } </SplitItem>
                        <SplitItem>
                            <Ansible unsupported={ !rule.has_playbook } />
                        </SplitItem>
                    </Split>
                    <Split>
                        <SplitItem> <Battery label='Impact' severity={ rule.impact.impact } /> </SplitItem>
                        <SplitItem> <Battery label='Likelihood' severity={ rule.likelihood } /> </SplitItem>
                        <SplitItem> <Battery label='Total Risk' severity={ rule.severity } /> </SplitItem>
                        <SplitItem><Battery label='Risk Of Change' severity={ rule.resolution_risk } /></SplitItem>
                    </Split>
                </CardHeader>
                { expanded && (<CardBody>
                    <Grid gutter='md' sm={ 12 }>
                        <GridItem>
                            <Card className='pf-t-light  pf-m-opaque-100'>
                                <CardHeader> <ThumbsUpIcon /> Detected Issues</CardHeader>
                                <CardBody>
                                    <ReactMarkdown source={ rule.reason } escapeHtml={ false }/>
                                </CardBody>
                            </Card>
                        </GridItem>
                        <GridItem>
                            <Card className='pf-t-light  pf-m-opaque-100'>
                                <CardHeader> <BullseyeIcon /> Steps to resolve</CardHeader>
                                <CardBody>
                                    { report.resolution && <div>{ report.resolution.resolution }</div> }
                                </CardBody>
                            </Card>
                        </GridItem>
                        <GridItem>
                            <LightbulbIcon /><strong>Related Knowledgebase articles: </strong>
                            <a href={ `${kbaDetail.view_uri}` } rel="noopener">{ kbaDetail.publishedTitle }</a>
                        </GridItem>
                        <div>
                            <List>
                                { rule.more_info && (
                                    <ListItem>
                                        <ReactMarkdown source={ rule.more_info } escapeHtml={ false }/>
                                    </ListItem>
                                ) }
                                <ListItem>
                                    { `To learn how to upgrade packages, see "` }
                                    <a href="https://access.redhat.com/solutions/9934" rel="noopener">What is yum and how do I use it?</a>
                                    { `."` }
                                </ListItem>
                                <ListItem>{ `The Customer Portal page for the ` }
                                    <a href="https://access.redhat.com/security/" rel="noopener">Red Hat Security Team</a>
                                    { ` contains more information about policies, procedures, and alerts for Red Hat Products.` }
                                </ListItem>
                                <ListItem>{ `The Security Team also maintains a frequently updated blog at ` }
                                    <a href="https://securityblog.redhat.com" rel="noopener">securityblog.redhat.com</a>.
                                </ListItem>
                            </List>
                        </div>
                    </Grid>

                </CardBody>)
                }
            </Card>
        );
    }
}

export default ExpandableRulesCard;

ExpandableRulesCard.defaultProps = {
    report: {},
    isExpanded: true,
    kbaDetails: []
};

ExpandableRulesCard.propTypes = {
    report: propTypes.object,
    isExpanded: propTypes.bool,
    kbaDetails: propTypes.array
};
