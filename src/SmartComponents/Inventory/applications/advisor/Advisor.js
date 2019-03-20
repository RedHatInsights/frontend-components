import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { addNotification } from '../../../Notifications';
import '@patternfly/patternfly/utilities/Display/display.css';
import '@patternfly/patternfly/utilities/Flex/flex.css';
import { List } from 'react-content-loader';
import ExpandableRulesCard from './ExpandableRulesCard';
import { Card, CardBody, CardHeader, Level, LevelItem } from '@patternfly/react-core';
import { CommentSlashIcon, FrownOpenIcon } from '@patternfly/react-icons';
import { withRouter } from 'react-router-dom';
import RemediationButton from '../../../Remediations/RemediationButton';

import './advisor.scss';

const SYSTEM_FETCH_URL = '/api/insights/v1/system/';

class InventoryRuleList extends Component {
    state = {
        expanded: true,
        inventoryReportFetchStatus: 'pending',
        inventoryReport: {},
        activeReports: [],
        kbaDetails: [],
        remediation: false
    };

    componentDidMount () {
        this.fetchEntityRules();
    }

    processRemediation (systemId, reports) {
        const issues = reports.filter(r => r.rule.has_playbook).map(r => ({ id: `advisor:${r.rule.rule_id}`, description: r.rule.description }));

        return issues.length ?
            { issues, systems: [ systemId ]} :
            false;
    }

    async fetchEntityRules () {
        const { entity } = this.props;
        try {
            await insights.chrome.auth.getUser();
            const data = await fetch(`${SYSTEM_FETCH_URL}${entity.id}/reports`, { credentials: 'include' })
            .then(data => data.json()).catch(error => { throw error; });
            this.setState({
                inventoryReport: data,
                activeReports: this.sortActiveReports(data.active_reports),
                inventoryReportFetchStatus: 'fulfilled',
                remediation: this.processRemediation(entity.id, data.active_reports)
            });
            const kbaIds = data && data.active_reports.map(report => report.rule.node_id).join(` OR `);
            this.fetchKbaDetails(kbaIds);
        } catch (error) {
            this.props.addNotification({
                variant: 'danger',
                dismissable: true,
                title: '',
                description: 'Inventory item rule fetch failed.'
            });
            this.setState({
                inventoryReportFetchStatus: 'failed'
            });
        }
    }

    async fetchKbaDetails (kbaIds) {
        try {
            const data = await fetch(`/rs/search?q=id:(${kbaIds})&fl=view_uri,id,publishedTitle`, { credentials: 'include' })
            .then(data => data.json());
            this.setState({
                kbaDetails: data.response.docs
            });
        } catch (error) {
            this.props.addNotification({
                variant: 'danger',
                dismissable: true,
                title: '',
                description: 'KBA fetch failed.'
            });
        }
    }

    sortActiveReports (activeReports) {
        const reports = activeReports;
        const activeRuleIndex = activeReports.findIndex(report => report.rule.rule_id === this.props.match.params.id);
        const activeReport = reports.splice(activeRuleIndex, 1);

        return activeRuleIndex !== -1 ? [ activeReport[0], ...reports ] : activeReports;
    }

    expandAll (expanded) {
        this.setState({ expanded: !expanded });
    }

    buildRuleCards = () => {
        const { activeReports, expanded, kbaDetails, remediation } = this.state;

        return (
            <Fragment>
                <Level>
                    <LevelItem>
                        <a onClick={ e => {
                            e.preventDefault();
                            this.expandAll(expanded);
                        } } rel="noopener">
                            { (expanded ? `Collapse All` : `Expand All`) }
                        </a>
                    </LevelItem>
                    <LevelItem>
                        <RemediationButton
                            isDisabled={ !remediation }
                            dataProvider={ () => remediation }
                            onRemediationCreated={ result => this.props.addNotification(result.getNotification()) } />
                    </LevelItem>
                </Level>
                {
                    activeReports && activeReports.map((report, key) =>
                        <ExpandableRulesCard key={ key } report={ report } isExpanded={ expanded } kbaDetails={ kbaDetails }/>
                    ) }
            </Fragment>
        );
    };

    render () {
        const { activeReports, inventoryReportFetchStatus } = this.state;
        return (
            <Fragment>
                { inventoryReportFetchStatus === 'pending' && (
                    <Card>
                        <CardBody>
                            <List/>
                        </CardBody>
                    </Card>
                ) }
                { inventoryReportFetchStatus === 'fulfilled' && (
                    activeReports ? this.buildRuleCards() :
                        <Card className="ins-empty-rule-cards">
                            <CardHeader>
                                <CommentSlashIcon size='lg'/>
                            </CardHeader>
                            <CardBody>
                                No data available for configuration assessment at the moment.
                            </CardBody>
                        </Card>
                ) }
                { inventoryReportFetchStatus === 'failed' && (
                    <Card className="ins-empty-rule-cards">
                        <CardHeader>
                            <FrownOpenIcon size='lg'/>
                        </CardHeader>
                        <CardBody>
                            There was an error fetching rules list for this Entity. Please show your administrator this screen.
                        </CardBody>
                    </Card>
                ) }
            </Fragment>
        );
    }
}

InventoryRuleList.propTypes = {
    entity: PropTypes.object,
    addNotification: PropTypes.func,
    match: PropTypes.object
};

const mapStateToProps = ({ entityDetails: { entity }}) => ({
    entity
});

const mapDispatchToProps = dispatch => ({
    addNotification: data => dispatch(addNotification(data))
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(InventoryRuleList));
