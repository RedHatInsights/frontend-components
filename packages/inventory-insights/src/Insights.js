/* eslint-disable camelcase */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { List } from 'react-content-loader';
import {
    Card,
    CardBody,
    Dropdown,
    DropdownItem,
    DropdownPosition,
    KebabToggle,
    Split,
    SplitItem,
    ToolbarGroup,
    ToolbarItem
} from '@patternfly/react-core';
import { CheckIcon, TimesCircleIcon } from '@patternfly/react-icons';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import { flatten } from 'lodash';
import { global_success_color_200 } from '@patternfly/react-tokens';
import { withRouter } from 'react-router-dom';
import MessageState from './MessageState';
import RemediationButton from '@redhat-cloud-services/frontend-components-remediations/RemediationButton';
import { TableToolbar, Section, Battery } from '@redhat-cloud-services/frontend-components';

import './insights.scss';
import ReportDetails from './ReportDetails';

const SYSTEM_FETCH_URL = '/api/insights/v1/system/';

class InventoryRuleList extends Component {
    state = {
        inventoryReportFetchStatus: 'pending',
        rows: [],
        remediation: false,
        isKebabOpen: false
    };

    componentDidMount () {
        this.fetchEntityRules();
    }

    processRemediation (systemId, reports) {
        const issues = reports.filter(r => r.resolution.has_playbook).map(
            r => ({ id: `advisor:${r.rule.rule_id}`, description: r.rule.description })
        );

        return issues.length ?
            { issues, systems: [ systemId ]} :
            false;
    }

    async fetchEntityRules () {
        const { entity } = this.props;
        try {
            await insights.chrome.auth.getUser();
            const data = await fetch(`${SYSTEM_FETCH_URL}${entity.id}/reports/`, { credentials: 'include' })
            .then(data => data.json()).catch(error => { throw error; });
            const kbaIds = data.map(report => report.rule.node_id).join(` OR `);
            const kbaDetails = await fetch(`https://access.redhat.com/rs/search?q=id:(${kbaIds})&fl=view_uri,id,publishedTitle`,
                { credentials: 'include' }).then(data => data.json());
            console.error(kbaDetails)
            this.setState({
                rows: this.buildRows(this.sortActiveReports(data), kbaDetails.response.docs),
                inventoryReportFetchStatus: 'fulfilled',
                remediation: this.processRemediation(entity.id, data)
            });
        } catch (error) {
            this.setState({
                inventoryReportFetchStatus: 'failed'
            });
            console.warn(error, 'Entity rules fetch failed.');
        }
    }

    sortActiveReports = (activeReports) => {
        const reports = [ ...activeReports ];
        const activeRuleIndex = activeReports.findIndex(report => report.rule.rule_id === this.props.match.params.id);
        const activeReport = reports.splice(activeRuleIndex, 1);

        return activeRuleIndex !== -1 ? [ activeReport[0], ...reports ] : activeReports;
    };

    handleOnCollapse = (event, rowId, isOpen) => {
        const rows = [ ...this.state.rows ];
        rows[rowId] = { ...rows[rowId], isOpen };
        this.setState({
            rows
        });
    };

    buildRows = (activeReports, kbaDetails) => {
        return flatten(activeReports.map((value, key) => {
            const parent = key * 2;
            const rule = value.rule;
            const kbaDetail = kbaDetails.filter(article => article.id === value.rule.node_id)[0] || {};

            return [
                {
                    isOpen: true,
                    cells: [
                        {
                            title: <Fragment>
                                <Split>
                                    <SplitItem> { rule.category.name } &gt; </SplitItem>
                                    <SplitItem isFilled> { rule.description } </SplitItem>
                                    <SplitItem className="smallFontSizeOverride">
                                        { value.resolution.has_playbook &&
                                        <Fragment><CheckIcon className='successColorOverride'/> Ansible remediation </Fragment>
                                        }
                                    </SplitItem>
                                </Split>
                                <Section type='icon-group__with-major' className='batterySectionOverrides smallFontSizeOverride'>
                                    <Battery label='Impact' severity={ rule.impact.impact }/>
                                    <Battery label='Likelihood' severity={ rule.likelihood }/>
                                    <Battery label='Total Risk' severity={ rule.total_risk }/>
                                    <Battery label='Risk Of Change' severity={ value.resolution.resolution_risk.risk }/>
                                </Section>
                            </Fragment>
                        }
                    ]
                },
                {
                    parent,
                    fullWidth: true,
                    cells: [{
                        title: <ReportDetails key={ `child-${key}` } report={ value } kbaDetail={ kbaDetail }/>
                    }]
                }
            ];
        }));
    };

    onKebabToggle = isOpen => {
        this.setState({
            isKebabOpen: isOpen
        });
    };

    onKebabSelect = event => {
        const { rows } = this.state;
        const isOpen = event.target.id === 'insights-expand-all';
        rows.map((row, key) => {
            if (row.hasOwnProperty('isOpen')) {
                row.isOpen = isOpen;
                isOpen && this.handleOnCollapse(null, key, isOpen);
            }
        });

        this.setState({
            isKebabOpen: !this.state.isKebabOpen
        });
    };

    buildKebab = () => {
        const { isKebabOpen } = this.state;
        return <Dropdown
            onToggle={ this.onKebabToggle }
            onSelect={ this.onKebabSelect }
            position={ DropdownPosition.right }
            toggle={ <KebabToggle onToggle={ this.onKebabToggle }/> }
            isOpen={ isKebabOpen }
            isPlain
            dropdownItems={ [
                <DropdownItem component="button" key="collapse" id="insights-collapse-all">
                    Collapse all
                </DropdownItem>,
                <DropdownItem component="button" key="expand" id="insights-expand-all">
                    Expand all
                </DropdownItem>
            ] }
        />;
    };

    render () {
        const { remediation, inventoryReportFetchStatus, rows } = this.state;
        const results = rows ? rows.length / 2 : 0;
        return <Fragment>
            { inventoryReportFetchStatus === 'pending' ||
            inventoryReportFetchStatus === 'fulfilled' && (results > 0 && <TableToolbar className='pf-u-justify-content-space-between'>
                <ToolbarGroup>
                    <ToolbarItem>
                        <RemediationButton
                            isDisabled={ !remediation }
                            dataProvider={ () => remediation }
                            onRemediationCreated={ result => this.props.addNotification(result.getNotification()) }/>
                    </ToolbarItem>
                    <ToolbarItem>{ this.buildKebab() }</ToolbarItem>
                </ToolbarGroup>
                <ToolbarGroup>
                    <ToolbarItem>
                        { results === 1 ? `${results} rule` : `${results} rules` }
                    </ToolbarItem>
                </ToolbarGroup>
            </TableToolbar>) }
            { inventoryReportFetchStatus === 'pending' && (
                <Card>
                    <CardBody>
                        <List/>
                    </CardBody>
                </Card>
            ) }
            { inventoryReportFetchStatus === 'fulfilled' && (results > 0 ?
                <Table aria-label={ 'rule-table' } onCollapse={ this.handleOnCollapse } rows={ rows } cells={ [ '' ] }>
                    <TableHeader/>
                    <TableBody/>
                </Table>
                :
                <Card>
                    <CardBody>
                        <MessageState icon={ CheckIcon } iconStyle={ { color: global_success_color_200.value } } title='No rule hits'
                            text={ `No known rules affect this system` }/>
                    </CardBody></Card>
            ) }
            { inventoryReportFetchStatus === 'failed' && this.props.entity &&
            <MessageState icon={ TimesCircleIcon } title='Error getting rules'
                text={ this.props.entity ? `There was an error fetching rules list for this entity. Refresh your page to try again.`
                    : `This entity can not be found or might no longer be registered to Red Hat Insights.` }/>

            }
        </Fragment>;
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
