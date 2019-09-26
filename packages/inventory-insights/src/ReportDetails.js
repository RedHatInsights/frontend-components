import React, { Fragment } from 'react';
import propTypes from 'prop-types';
import classNames from 'classnames';
import { BullseyeIcon, ExternalLinkAltIcon, InfoCircleIcon, LightbulbIcon, ThumbsUpIcon } from '@patternfly/react-icons';
import { Card, CardBody, CardHeader, List, ListItem, Stack, StackItem } from '@patternfly/react-core';
import doT from 'dot';
import sanitizeHtml from 'sanitize-html';
import marked from 'marked';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';

import '@redhat-cloud-services/frontend-components/components/Section.css';
import './insights.scss';

class ReportDetails extends React.Component {
    templateProcessor = (template, definitions) => {
        const DOT_SETTINGS = { ...doT.templateSettings, varname: [ 'pydata' ], strip: false };
        const sanitizeOptions = {
            allowedAttributes: { ...sanitizeHtml.defaults.allowedAttributes, '*': [ 'style' ] },
            transformTags: {
                ul(tagName, attribs) {
                    return {
                        tagName: 'ul',
                        attribs: { class: 'pf-c-list' }
                    };
                }
            },
            textFilter(text) {
                return text.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<');
            }
        };
        const externalLinkIcon = '';

        try {
            const compiledDot = definitions ? doT.template(template, DOT_SETTINGS)(definitions) : template;
            const compiledMd = marked(sanitizeHtml(compiledDot, sanitizeOptions));

            return <div dangerouslySetInnerHTML={ {
                __html: compiledMd
                .replace(/<ul>/gim, `<ul class="pf-c-list" style="font-size: inherit">`)
                .replace(/<a>/gim, `<a> rel="noopener noreferrer" target="_blank"`)
                .replace(/<\/a>/gim, ` ${externalLinkIcon}</a>`)
            } } />;
        } catch (error) {
            console.warn(error, definitions, template); // eslint-disable-line no-console
            return <React.Fragment> Ouch. We were unable to correctly render this text, instead please enjoy the raw data.
                <pre><code>{ template }</code></pre>
            </React.Fragment>;
        }
    };

    render() {
        const { report, kbaDetail, kbaLoading } = this.props;
        const rule = report.rule || report;
        let rulesCardClasses = classNames(
            'ins-c-inventory-advisor__card',
            'ins-c-rules-card'
        );
        return (
            <Card style={ { boxShadow: 'none' } }>
                <CardBody>
                    <Stack className={ rulesCardClasses } widget-type='InsightsRulesCard' gutter='md'>
                        <StackItem>
                            <Card className='ins-m-card__flat'>
                                <CardHeader>
                                    <BullseyeIcon />
                                    <strong> Detected issues</strong>
                                </CardHeader>
                                <CardBody>
                                    { rule.reason && this.templateProcessor(rule.reason, report.details) }
                                </CardBody>
                            </Card>
                        </StackItem>
                        <StackItem>
                            <Card className='ins-m-card__flat'>
                                <CardHeader>
                                    <ThumbsUpIcon />
                                    <strong> Steps to resolve</strong>
                                </CardHeader>
                                <CardBody>
                                    { report.resolution && this.templateProcessor(report.resolution.resolution, report.details) }
                                </CardBody>
                            </Card>
                        </StackItem>
                        <StackItem>
                            <Card className='ins-m-card__flat'>
                                <CardHeader>
                                    <LightbulbIcon /><strong> Related Knowledgebase article: </strong>
                                </CardHeader>
                                <CardBody>
                                    { kbaDetail && kbaDetail.view_uri ?
                                        <a rel="noopener noreferrer" target="_blank" href={ `${kbaDetail.view_uri}` }>
                                            { kbaDetail.publishedTitle } <ExternalLinkAltIcon />
                                        </a>
                                        : kbaLoading ? <Skeleton size={ SkeletonSize.sm } />
                                            : <Fragment>No related Knowledgebase article.</Fragment> }
                                </CardBody>
                            </Card>
                        </StackItem>
                        <StackItem>
                            <Card className='ins-m-card__flat'>
                                <CardHeader>
                                    <InfoCircleIcon /><strong> Additional info:</strong>
                                </CardHeader>
                                <CardBody>
                                    { rule.more_info && this.templateProcessor(rule.more_info) }
                                    <List style={ { fontSize: 'inherit' } }>
                                        <ListItem>
                                            { `To learn how to upgrade packages, see ` }
                                            <a rel="noopener noreferrer" target="_blank" href="https://access.redhat.com/solutions/9934">
                                                What is yum and how do I use it? <ExternalLinkAltIcon />
                                            </a>{ `.` }
                                        </ListItem>
                                        <ListItem>{ `The Customer Portal page for the ` }
                                            <a rel="noopener noreferrer" target="_blank" href="https://access.redhat.com/security/">
                                                Red Hat Security Team <ExternalLinkAltIcon />
                                            </a> { ` contains more information about policies, procedures, and alerts for
                                                Red Hat Products.` }
                                        </ListItem>
                                        <ListItem>{ `The Security Team also maintains a frequently updated blog at ` }
                                            <a rel="noopener noreferrer" target="_blank" href="https://securityblog.redhat.com">
                                                securityblog.redhat.com <ExternalLinkAltIcon />
                                            </a>.
                                        </ListItem>
                                    </List>
                                </CardBody>
                            </Card>
                        </StackItem>
                    </Stack>
                </CardBody>
            </Card>
        );
    }
}

export default ReportDetails;

ReportDetails.defaultProps = {
    report: {},
    kbaDetail: {}
};

ReportDetails.propTypes = {
    report: propTypes.object,
    kbaDetail: propTypes.object,
    kbaLoading: propTypes.bool
};
