import React from 'react';
import propTypes from 'prop-types';
import classNames from 'classnames';
import {
    BullseyeIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    ExternalLinkAltIcon,
    InfoCircleIcon,
    LightbulbIcon,
    ThumbsUpIcon
} from '@patternfly/react-icons';
import { Card, CardBody, CardHeader, List, ListItem, Split, SplitItem, Stack, StackItem } from '@patternfly/react-core';
import doT from 'dot';
import sanitizeHtml from 'sanitize-html';
import marked from 'marked';

import { Ansible, Battery, Section } from '@redhat-cloud-services/frontend-components';
import '@redhat-cloud-services/frontend-components/components/Section.css';
import './insights.scss';

class ExpandableRulesCard extends React.Component {
    state = {
        expanded: true,
        kbaDetail: {}
    };

    componentDidUpdate (prevProps) {
        if (this.props.isExpanded !== prevProps.isExpanded) {
            this.setState({ expanded: this.props.isExpanded });
        }

        if (this.props.kbaDetails !== prevProps.kbaDetails) {
            this.setState({
                kbaDetail: this.props.kbaDetails.filter(article => article.id === this.props.report.rule.node_id)[0]
            });
        }
    }

    toggleExpanded = () => {
        this.setState({ expanded: !this.state.expanded });
    };

    templateProcessor = (template, definitions) => {
        const DOT_SETTINGS = { ...doT.templateSettings, varname: [ 'pydata' ], strip: false };
        const sanitizeOptions = {
            allowedAttributes: {
                '*': [ 'style' ]
            },
            transformTags: {
                ul: sanitizeHtml.simpleTransform('ul', { class: 'pf-c-list' })
            }
        };
        const externalLinkIcon = '';

        try {
            const compiledDot = definitions ? doT.template(template, DOT_SETTINGS)(definitions) : template;
            const compiledMd = marked(sanitizeHtml(compiledDot, sanitizeOptions));

            return <div dangerouslySetInnerHTML={ {
                __html: compiledMd
                .replace(/<ul>/gim, `<ul class="pf-c-list" style="font-size: inherit">`)
                .replace(/<\/a>/gim, ` ${externalLinkIcon}</a>`)
            } } />;
        } catch (error) {
            console.warn(error, definitions, template); // eslint-disable-line no-console
            return <React.Fragment> Ouch. We were unable to correctly render this text, instead please enjoy the raw data.
                <pre><code>{ template }</code></pre>
            </React.Fragment>;
        }
    };

    render () {
        const { report } = this.props;
        const rule = report.rule || report;
        const { expanded, kbaDetail } = this.state;
        let rulesCardClasses = classNames(
            'ins-c-inventory-advisor__card',
            'ins-c-rules-card'
        );
        return (
            <Card className={ rulesCardClasses } widget-type='InsightsRulesCard'>
                <CardHeader>
                    <Split onClick={ this.toggleExpanded }>
                        <SplitItem>
                            { !expanded && <ChevronRightIcon/> } { expanded && <ChevronDownIcon/> }
                        </SplitItem>
                        <SplitItem> { rule.category.name } &gt; </SplitItem>
                        <SplitItem isFilled> { rule.description } </SplitItem>
                        <SplitItem>
                            <Ansible unsupported={ !report.resolution.has_playbook }/>
                        </SplitItem>
                    </Split>
                    <Section type='icon-group__with-major'>
                        <Battery label='Impact' severity={ rule.impact.impact }/>
                        <Battery label='Likelihood' severity={ rule.likelihood }/>
                        <Battery label='Total Risk' severity={ rule.total_risk }/>
                        <Battery label='Risk Of Change' severity={ report.resolution.resolution_risk.risk }/>
                    </Section>
                </CardHeader>
                { expanded && <CardBody>
                    <Stack gutter='md'>
                        <StackItem>
                            <Card className='ins-m-card__flat'>
                                <CardHeader>
                                    <BullseyeIcon/>
                                    <strong>Detected issues</strong>
                                </CardHeader>
                                <CardBody>
                                    { rule.reason && this.templateProcessor(rule.reason, report.details) }
                                </CardBody>
                            </Card>
                        </StackItem>
                        <StackItem>
                            <Card className='ins-m-card__flat'>
                                <CardHeader>
                                    <ThumbsUpIcon/>
                                    <strong>Steps to resolve</strong>
                                </CardHeader>
                                <CardBody>
                                    { report.resolution && this.templateProcessor(report.resolution.resolution, report.details) }
                                </CardBody>
                            </Card>
                        </StackItem>
                        { kbaDetail && kbaDetail.view_uri && <StackItem>
                            <Card className='ins-m-card__flat'>
                                <CardHeader>
                                    <LightbulbIcon/><strong>Related Knowledgebase article: </strong>
                                </CardHeader>
                                <CardBody>
                                    <a href={ `${kbaDetail.view_uri}` } rel="noopener">{ kbaDetail.publishedTitle } <ExternalLinkAltIcon/></a>
                                </CardBody>
                            </Card>
                        </StackItem> }
                        <StackItem>
                            <Card className='ins-m-card__flat'>
                                <CardHeader>
                                    <InfoCircleIcon/><strong>Additional info:</strong>
                                </CardHeader>
                                <CardBody>
                                    { rule.more_info && this.templateProcessor(rule.more_info) }
                                    <List style={ { fontSize: 'inherit' } }>
                                        <ListItem>
                                            { `To learn how to upgrade packages, see ` }<a href="https://access.redhat.com/solutions/9934"
                                                rel="noopener">
                                            What is yum and how do I use it? <ExternalLinkAltIcon/>
                                            </a>{ `.` }
                                        </ListItem>
                                        <ListItem>{ `The Customer Portal page for the ` }
                                            <a href="https://access.redhat.com/security/" rel="noopener">Red Hat Security Team
                                                <ExternalLinkAltIcon/></a> { ` contains more information about policies, procedures, and alerts for
                                                Red Hat Products.` }
                                        </ListItem>
                                        <ListItem>{ `The Security Team also maintains a frequently updated blog at ` }
                                            <a href="https://securityblog.redhat.com"
                                                rel="noopener">securityblog.redhat.com <ExternalLinkAltIcon/></a>.
                                        </ListItem>
                                    </List>
                                </CardBody>
                            </Card>
                        </StackItem>
                    </Stack>
                </CardBody> }
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
