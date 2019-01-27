import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { addNotification } from '../../../Notifications';
import '@patternfly/patternfly-next/utilities/Display/display.css';
import '@patternfly/patternfly-next/utilities/Flex/flex.css';
import { List } from 'react-content-loader';
import ExpandableRulesCard from './ExpandableRulesCard';
import { Card, CardBody, CardHeader } from '@patternfly/react-core';
import { CommentSlashIcon, FrownOpenIcon } from '@patternfly/react-icons';
import './advisor.scss';

const SYSTEM_FETCH_URL = '/r/insights/platform/advisor/v1/system/';

class InventoryRuleList extends Component {
    state = {
        expanded: true,
        inventoryReportFetchStatus: 'pending',
        inventoryReport: {},
        kbaDetails: []
    };

    componentDidMount() {
        this.fetchEntityRules();
    }

    async fetchEntityRules() {
        const { entity } = this.props;
        try {
            await insights.chrome.auth.getUser();
            const data = await fetch(`${SYSTEM_FETCH_URL}${entity.id}/reports`).then(data => data.json()).catch(error => {throw error;});
            this.setState({
                inventoryReport: data,
                inventoryReportFetchStatus: 'fulfilled'
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

    async fetchKbaDetails(kbaIds) {
        try {
            const data = await fetch(`/rs/search?q=id:(${kbaIds})&fl=view_uri,id,publishedTitle`).then(data => data.json());
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

    expandAll(expanded) {
        this.setState({ expanded: !expanded });
    }

    buildRuleCards = () => {
        const { inventoryReport, expanded, kbaDetails } = this.state;
        return (
            <Fragment>
                <div className="pf-u-display-flex pf-u-flex-row-reverse">
                    <a onClick={ e => {
                        e.preventDefault();
                        this.expandAll(expanded);
                    } } rel="noopener">
                        { (expanded ? `Collapse All` : `Expand All`) }
                    </a>
                </div>
                {
                    inventoryReport && inventoryReport.active_reports && inventoryReport.active_reports.map((report, key) =>
                        <ExpandableRulesCard key={ key } report={ report } isExpanded={ expanded } kbaDetails={ kbaDetails }/>
                    ) }
            </Fragment>
        );
    }

    render() {
        const { inventoryReport, inventoryReportFetchStatus } = this.state;
        return (
            <Fragment>
                { inventoryReportFetchStatus === 'pending' && (
                    <Card>
                        <CardBody>
                            <List />
                        </CardBody>
                    </Card>
                ) }
                { inventoryReportFetchStatus === 'fulfilled' && (
                    inventoryReport ? this.buildRuleCards() :
                        <Card className="ins-empty-rule-cards">
                            <CardHeader>
                                <CommentSlashIcon size='lg' />
                            </CardHeader>
                            <CardBody>
                                No data available for configuration assessment at the moment.
                            </CardBody>
                        </Card>
                ) }
                { inventoryReportFetchStatus === 'failed' && (
                    <Card className="ins-empty-rule-cards">
                        <CardHeader>
                            <FrownOpenIcon size='lg' />
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
    addNotification: PropTypes.func

};

const mapStateToProps = ({ entityDetails: { entity }}) => ({
    entity
});

const mapDispatchToProps = dispatch => ({
    addNotification: data => dispatch(addNotification(data))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InventoryRuleList);
